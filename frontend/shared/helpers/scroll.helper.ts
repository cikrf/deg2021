export function isScrollAtBottom(scrollHeight: number, offset: number, innerHeight: number): boolean {
  const heightCeil = Math.ceil(scrollHeight - offset);
  const heightFloor = Math.floor(scrollHeight - offset);

  return heightCeil === innerHeight
    || heightFloor === innerHeight;
}
