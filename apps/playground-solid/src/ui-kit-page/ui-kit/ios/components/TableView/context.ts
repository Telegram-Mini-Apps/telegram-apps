import { Accessor, createContext, useContext } from 'solid-js';

export interface TableViewContextItem {
  index: number;
}

export interface TableViewContextType {
  items: Accessor<TableViewContextItem[]>;

  register(): () => void;

  activate(index: number): void;

  deactivate(): void;

  unregister(position: number): void;
}

export const TableViewContext = createContext<TableViewContextType>();

export function useTableViewContext(): TableViewContextType | undefined {
  return useContext(TableViewContext);
}