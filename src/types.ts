export interface BootAction {
  actionName: string;
  action: () => Promise<void> | void;
}
