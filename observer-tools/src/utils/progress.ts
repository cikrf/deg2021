export const progress = (action: string, n: number, total: number, precision = 2) => {
  const percent = (n / total * 100).toFixed(precision)
  if (n === total) {
    process.stdout.write(`${action} ${percent}% завершено... \r`)
    process.stdout.write(`\n`)
  } else {
    process.stdout.write(`  ${action} ${percent}% завершено... \r`)
  }
}
