export interface GeneratedCode {
  fileName: string;
  content: string;
  language: string;
}

export interface Step {
  title: string;
  description: string;
}

export interface FileStructure {
  name: string;
  content: string;
  language: string;
  isSelected: boolean;
}