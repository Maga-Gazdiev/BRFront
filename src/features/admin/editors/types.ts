import type { Content } from '../../../shared/api/types';
export type SectionUpdate = <K extends 'hero' | 'about' | 'contact' | 'settings'>(
  name: K,
  field: keyof Content[K],
  value: string,
) => void;
export interface EditorProps {
  data: Content;
  change: (content: Content) => void;
  token: string;
  section: SectionUpdate;
}
