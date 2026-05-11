/**
 * Détection « environnement local » pour simulation admin / dev tooling.
 * (Sans élargir au LAN — évite d’exposer POST admin-sim sur réseau local.)
 */

export function isLocalDevHostname(hostname: string): boolean {
  const h = hostname.trim().toLowerCase()
  return (
    h === 'localhost' ||
    h === '127.0.0.1' ||
    h === '::1' ||
    h === '0:0:0:0:0:0:0:1'
  )
}

/** Pour Host-type headers typiques : `localhost:3010`, `[::1]:3010`, `127.0.0.1:3010` */
export function isHostHeaderLocalDev(host: string | null | undefined): boolean {
  if (!host) return false
  try {
    const hn = new URL(`http://${host.trim()}`).hostname.toLowerCase()
    return isLocalDevHostname(hn)
  } catch {
    return false
  }
}
