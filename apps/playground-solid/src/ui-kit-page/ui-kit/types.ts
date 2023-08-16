export type CreateClasses<ClassName extends string> = {
  [K in ClassName]?: string;
};

export interface WithClasses<T> {
  classes?: T;
}