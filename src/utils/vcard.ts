export interface ContactData {
    firstName: string;
    lastName: string;
    title: string;
    company: string;
    mobile: string;
    work: string;
    email: string;
    website: string;
    address: string;
    photoBase64?: string;
}

export const generateVCard = (data: ContactData, excludePhoto = false): string => {
    const {
        firstName,
        lastName,
        title,
        company,
        mobile,
        work,
        email,
        website,
        address,
        photoBase64,
    } = data;

    let vcard = `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
FN:${firstName} ${lastName}
ORG:${company}
TITLE:${title}
TEL;TYPE=CELL:${mobile}
TEL;TYPE=WORK:${work}
EMAIL;TYPE=WORK:${email}
URL:${website}
ADR;TYPE=WORK:;;${address};;;;
`;

    if (photoBase64 && !excludePhoto) {
        // Remove the data:image/png;base64, prefix if present
        const cleanBase64 = photoBase64.replace(/^data:image\/[a-z]+;base64,/, "");
        vcard += `PHOTO;ENCODING=b;TYPE=JPEG:${cleanBase64}\n`;
    }

    vcard += `END:VCARD`;
    return vcard;
};
