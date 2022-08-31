import styled from "styled-components";

export const ScrollArea = styled.div`
  max-height: 460px;
  min-height: 460px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 13px;
  }
  &::-webkit-scrollbar-track {
    background-color: #e4e4e4;
    border-radius: 100px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 100px;
    border: 5px solid transparent;
    background-clip: content-box;
    background-color: #3abff8;
  }
`;
