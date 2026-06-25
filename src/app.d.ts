declare global {
  namespace App {
    type Locals = Record<string, unknown>;
    type Error = string | null;
  }
}
