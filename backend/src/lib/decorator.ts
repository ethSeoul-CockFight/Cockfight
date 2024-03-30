export function MeasureExecutionTime(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    const start = performance.now()
    const result = originalMethod.apply(this, args)
    const end = performance.now()
    console.log(`${propertyKey} execution time: ${end - start}ms`)
    return result
  }

  return descriptor
}


export function Retry<T extends (...args: any[]) => Promise<any>>(
  func: T,
  maxRetries = 30,
  retryInterval = 1000
): T {
  return async function (...args: any[]) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await func(...args)
      } catch (e) {
        console.log(`Retrying ${i} err ${func.name}`)
        if (i === maxRetries - 1) throw e
        await new Promise((resolve) => setTimeout(resolve, retryInterval))
      }
    }
  } as T
}
