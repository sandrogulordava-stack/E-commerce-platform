export const products = [
  {
    id: 1,
    name: 'უსადენო ყურსასმენი',
    category: 'აუდიო',
    price: 149,
    oldPrice: 189,
    icon: '🎧',
    description: 'კომფორტული ყურსასმენი ყოველდღიური მუსიკისთვის.',
    stock: 12,
  },
  {
    id: 2,
    name: 'პორტატული დინამიკი',
    category: 'აუდიო',
    price: 89,
    oldPrice: null,
    icon: '🔊',
    description: 'კომპაქტური დინამიკი სახლში და მოგზაურობისას.',
    stock: 8,
  },
  {
    id: 3,
    name: 'მექანიკური კლავიატურა',
    category: 'აქსესუარები',
    price: 179,
    oldPrice: 219,
    icon: '⌨️',
    description: 'მოსახერხებელი კლავიატურა სწავლასა და მუშაობაში.',
    stock: 10,
  },
  {
    id: 4,
    name: 'უსადენო მაუსი',
    category: 'აქსესუარები',
    price: 59,
    oldPrice: null,
    icon: '🖱️',
    description: 'მსუბუქი მაუსი ზუსტი მართვისთვის.',
    stock: 20,
  },
  {
    id: 5,
    name: 'ჭკვიანი საათი',
    category: 'ჭკვიანი მოწყობილობები',
    price: 229,
    oldPrice: 279,
    icon: '⌚',
    description: 'საათი აქტივობისა და შეტყობინებების სანახავად.',
    stock: 6,
  },
  {
    id: 6,
    name: 'ფიტნეს სამაჯური',
    category: 'ჭკვიანი მოწყობილობები',
    price: 99,
    oldPrice: null,
    icon: '📟',
    description: 'მსუბუქი სამაჯური ყოველდღიური აქტივობისთვის.',
    stock: 15,
  },
  {
    id: 7,
    name: 'პორტატული დამტენი',
    category: 'დამტენები',
    price: 79,
    oldPrice: 99,
    icon: '🔋',
    description: 'დამატებითი ენერგია ტელეფონისთვის გზაში.',
    stock: 9,
  },
  {
    id: 8,
    name: 'სწრაფი დამტენი',
    category: 'დამტენები',
    price: 39,
    oldPrice: null,
    icon: '🔌',
    description: 'კომპაქტური დამტენი ყოველდღიური გამოყენებისთვის.',
    stock: 18,
  },
];

export const categories = [
  ...new Set(products.map((product) => product.category)),
];

export const getProduct = (id) =>
  products.find((product) => product.id === Number(id));

// რეალური სერვერის ნაცვლად ლოკალური მონაცემების დაგვიანებული ჩატვირთვა.
export function loadProducts(signal) {
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      reject(new DOMException('ჩატვირთვა შეწყდა', 'AbortError'));
    };

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      resolve(products);
    }, 400);

    if (signal?.aborted) {
      abort();
    } else {
      signal?.addEventListener('abort', abort, { once: true });
    }
  });
}