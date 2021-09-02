export const parseJsonEnv = (data: string = '', key?: string) => {
  try {
    const parsed = JSON.parse(data)
    return parsed
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`Error env ${key} is not a valid JSON array`)
    return []
  }
}
