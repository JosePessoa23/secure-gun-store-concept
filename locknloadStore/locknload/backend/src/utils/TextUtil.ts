export class TextUtil {
  public static isUUID(text: string): boolean {
    // eslint-disable-next-line no-control-regex
    return new RegExp('\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b').test(text);
  }
}
