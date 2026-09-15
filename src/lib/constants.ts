export const BUSINESS_INFO = {
  name: 'Zinux Paints & Interior',
  tagline: 'Quality Finishing. Better Spaces. Reliable Power.',
  phoneDisplay: '+234 803 212 4315',
  phoneRaw: '+2348032124315',
  whatsappNumber: '2348032124315',
  email: 'tosola87@gmail.com',
  instagram: '@zinuxpaints_interior',
  instagramUrl: 'https://instagram.com/zinuxpaints_interior',
  facebook: 'Zinux Paints and Agro Allied Product',
  facebookUrl: 'https://www.facebook.com/search/top?q=Zinux%20Paints%20and%20Agro%20Allied%20Product',
  servicesList: ['Painting', 'POP & Interior Finishing', 'Solar Installation'],
  heroHeadlineParts: {
    part1: 'Quality Finishing.',
    part2: 'Better Spaces.',
    part3: 'Reliable Power.'
  },
  heroSubtext: 'Professional painting, POP & interior finishing, and solar installation for homes, businesses and other spaces.'
};

export const getWhatsAppUrl = (message?: string) => {
  const defaultText = `Hello Zinux Paints & Interior, I would like to inquire about your services.`;
  const text = message ? encodeURIComponent(message) : encodeURIComponent(defaultText);
  return `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${text}`;
};
