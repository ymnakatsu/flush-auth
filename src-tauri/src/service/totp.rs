use crate::db::account::Account;
use libreauth::oath::TOTPBuilder;
use tracing_unwrap::OptionExt;
use tracing_unwrap::ResultExt;

#[derive(serde::Serialize, Debug)]
pub struct TotpData {
    code: String,
}

/// Calc TOTP Code.
pub fn calc(id: String, accounts: Vec<Account>) -> TotpData {
    let acc = accounts
        .iter()
        .find(|a| a.id == id)
        .expect_or_log("ID not found.");
    calc_code(acc, Option::None)
}

/// Calc TOTP Code.
fn calc_code(account: &Account, timestamp: Option<i64>) -> TotpData {
    let mut builder = TOTPBuilder::new();
    if let Some(t) = timestamp {
        builder.timestamp(t);
    }
    let code = builder
        .base32_key(&account.secret_key)
        .finalize()
        .expect_or_log("Calc totp faild.")
        .generate();

    TotpData { code: code }
}

#[cfg(test)]
mod tests {
    use chrono::prelude::*;

    use crate::db::account::Account;
    use crate::service::totp::calc_code;

    #[test]
    fn calc_code_test() {
        let dummy = Utc.ymd(2022, 8, 1).and_hms(9, 10, 11);
        let dt = dummy.timestamp();
        let acc = &Account {
            id: "id".to_string(),
            secret_key: "AAAAAA".to_string(),
            account_name: "account_name".to_string(),
            issuer: "issuer".to_string(),
            sort: 0,
            created_at: dummy.to_string(),
            updated_at: dummy.to_string(),
        };

        let totp_data = calc_code(acc, Option::Some(dt));
        print!("{}", &totp_data.code);
        assert_eq!(totp_data.code, "381626");
    }
}
