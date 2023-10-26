'use server'

export async function getToken() {
    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: "POST", 
        // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials&client_id=22ccd93026c2444cb2371026caedbf78&client_secret=e368a3c1b7a74d02be2ca73e2e48fc57',
      })
   
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }


  export async function search(token: string, title: string, artist: string) {
    // honestly i have no clue what the track/artist filter does so im just gonna ignore it
    const res = await fetch('https://api.spotify.com/v1/search?q=' + artist + ' ' + title + '&type=track', {

        // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Authorization': 'Bearer ' + token
        },
      })
   
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      console.log(res)
    //   BQAul6COmT1zilzwEGMs2ud3kE172voj3L_Pz_PDIQeD0tjiQWk31enho_UWkN-6qINspJVEi9xt63JpUWWsyE0zxcqD0XQ9gbfg-8fXB02WtvL4luI
    //   BQAul6COmT1zilzwEGMs2ud3kE172voj3L_Pz_PDIQeD0tjiQWk31enho_UWkN-6qINspJVEi9xt63JpUWWsyE0zxcqD0XQ9gbfg-8fXB02WtvL4luI
    console.log('token' + token)
      throw new Error('Failed to fetch super data')
    }
   
    return res.json()
  }