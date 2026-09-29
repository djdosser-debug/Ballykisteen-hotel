import QRCode from 'qrcode';

export async function generateQrDataUrl(text: string, options?: { width?: number; margin?: number; darkColor?: string; lightColor?: string }): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: options?.width || 320,
      margin: options?.margin !== undefined ? options.margin : 1,
      color: {
        dark: options?.darkColor || '#14382c',
        light: options?.lightColor || '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}

export function buildWifiQrString(ssid: string, password: string, security: 'WPA' | 'WEP' | 'nopass' = 'WPA', hidden = false): string {
  // WiFi QR code standard format: WIFI:S:<SSID>;T:<WPA|WEP|nopass>;P:<PASSWORD>;H:<true|false>;;
  const escapedSsid = ssid.replace(/([\\;,:"])/g, '\\$1');
  const escapedPass = password.replace(/([\\;,:"])/g, '\\$1');
  return `WIFI:T:${security};S:${escapedSsid};P:${escapedPass};H:${hidden ? 'true' : 'false'};;`;
}
