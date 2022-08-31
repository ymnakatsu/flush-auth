import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Account } from "./Account";
import { useAccountRowState } from "../hooks/useAccountRowState";
import { useAccounts } from "../hooks/useAccounts";
import type { AccountData } from "../types/AccountTypes";
import type { DropResult } from "react-beautiful-dnd";

const reorder = (
  accounts: AccountData[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(accounts);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const Accounts = () => {
  const { accounts, setAccounts } = useAccounts();
  const { isDefault } = useAccountRowState();
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    let moved = reorder(
      accounts,
      result.source.index,
      result.destination.index
    );
    setAccounts([...moved]);
  };

  return (
    <>
      <DragDropContext onDragEnd={(r) => onDragEnd(r)}>
        <Droppable droppableId="accounts">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {provided.placeholder}
              {accounts.map((v, i) => {
                return (
                  <Draggable
                    key={`${v.id}`}
                    draggableId={`${v.id}`}
                    index={i}
                    isDragDisabled={isDefault}
                  >
                    {(provided) => (
                      <div
                        className="accounts"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <Account
                          key={i}
                          tabIndex={i}
                          draggableprovided={provided}
                          className="m-1"
                          {...v}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
