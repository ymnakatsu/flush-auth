// @generated automatically by Diesel CLI.

diesel::table! {
    accounts (id) {
        id -> Text,
        secret_key -> Text,
        account_name -> Text,
        issuer -> Text,
        sort -> Integer,
        created_at -> Text,
        updated_at -> Text,
    }
}
