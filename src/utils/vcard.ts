import { Profile } from '../types/profile';

/**
 * Generates and triggers download of a standardized vCard (VCF 3.0) file
 * allowing seamless one-tap saving to iOS Contacts & Android Google Contacts.
 */
export function downloadVCard(profile: Profile): void {
  const vcardLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.fullName}`,
    `N:${profile.fullName};;;;`,
  ];

  if (profile.company) {
    vcardLines.push(`ORG:${profile.company}`);
  }

  if (profile.title) {
    vcardLines.push(`TITLE:${profile.title}`);
  }

  if (profile.email) {
    vcardLines.push(`EMAIL;TYPE=INTERNET,PREF:${profile.email}`);
  }

  if (profile.phone) {
    vcardLines.push(`TEL;TYPE=CELL,VOICE:${profile.phone}`);
  }

  if (profile.whatsapp) {
    vcardLines.push(`TEL;TYPE=WORK,VOICE:${profile.whatsapp}`);
  }

  if (profile.website) {
    vcardLines.push(`URL:${profile.website}`);
  }

  if (profile.bio) {
    vcardLines.push(`NOTE:${profile.bio.replace(/\n/g, '\\n')}`);
  }

  if (profile.location) {
    vcardLines.push(`ADR;TYPE=WORK:;;${profile.location};;;;`);
  }

  vcardLines.push('END:VCARD');

  const vcardString = vcardLines.join('\r\n');
  const blob = new Blob([vcardString], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${profile.username || 'contact'}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
