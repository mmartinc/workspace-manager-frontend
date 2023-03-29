export const getData = async ({ endpoint }: { endpoint: string }) => {
  const hostname = `/api/v1`

  try {
    const response = await fetch(`${hostname}/${endpoint}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept-Language': 'en-EN',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      },
    })

    if (response.ok) {
      const fetchResult = await response.json()
      return fetchResult.data
    }
  } catch (err) {
    console.error(err)
    return {}
  }
}
