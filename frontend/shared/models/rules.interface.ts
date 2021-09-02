export interface Rules {
  rules: Rule[];
  checkBoxes: string[];
}

export interface Rule {
  title: string;
  content?: string[];
  notice?: string;
  list?: RulesDescription[];
}

export interface RulesDescription {
  title: string;
  content?: string[];
  notice?: string;
}
