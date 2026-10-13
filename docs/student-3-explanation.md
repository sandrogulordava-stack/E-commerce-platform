
# სტუდენტი 3 — მიმოხილვებისა და რეიტინგის სრული ახსნა

თქვენი ფაილებია `src/components/student3/index.jsx`, `reviews.css`, `src/hooks/student3/useFormValidation.js` და `src/utils/reviews.js`. ინდივიდუალური მოდული ამავე ფაილებით მუშაობს გაერთიანებულ პროექტში.

## მონაცემები და ყველა მდგომარეობა

მიმოხილვას აქვს `id`, `productId`, `author`, `text`, `rating`, `date`. `emptyForm` არის `{ author: '', text: '', rating: 0 }`. rating=0 ნიშნავს, რომ მომხმარებელს შეფასება ჯერ არ აურჩევია; შენახულ მიმოხილვაში დასაშვებია მხოლოდ 1–5.

| მდგომარეობა / ref | დანიშნულება |
| --- | --- |
| `productId`, `setProductId` | რომელი პროდუქტის კომენტარებს ვაჩვენებთ და რომელს ვაფასებთ. |
| `reviews`, `setReviews` | ყველა პროდუქტის მიმოხილვების სია; საწყისი მნიშვნელობა შენახული მონაცემიდან ან initialReviews-დან მოდის. |
| `values`, `setValues` | კონტროლირებადი ფორმის სამი ველი. |
| `average`, `setAverage` | არჩეული პროდუქტის საშუალო რეიტინგი. |
| `latestId`, `setLatestId` | ახალი მიმოხილვის ID, ვიზუალური გამოყოფისა და scroll-ისთვის. |
| `storageError`, `setStorageError` | ბრაუზერში შენახვის პრობლემა. |
| `latestReviewRef` | ახლად დამატებული კომენტარის article ელემენტზე მითითება. |
| `nameRef` | სახელის input-ის DOM ელემენტი. |
| `errors` | Custom Hook-ის შიგნით შენახული ვალიდაციის შეცდომები. |

## Hook-ების სრული გამოყენება

`useContext` იღებს საერთო products-ს და notify-ს. `useState(() => readStoredValue(...))` შეფასებებს lazy initialization-ით კითხულობს. დაზიანებული ან არასწორი სტრუქტურის მონაცემისას იხმარება საწყისი სამი შეფასება.

`useMemo`, `[reviews, productId]` დამოკიდებულებებით, ჯერ `.filter`-ით ტოვებს არჩეული პროდუქტის შეფასებებს და შემდეგ `.sort`-ით ალაგებს ახალი თარიღიდან ძველისკენ. `Date.parse(b.date) - Date.parse(a.date)` თარიღებს რიცხვებად ადარებს. `.filter` უკვე ახალ მასივს ქმნის, ამიტომ sort საწყის reviews-ს არ ცვლის.

პირველი `useEffect`, `[visibleReviews]` დამოკიდებულებით, `.reduce`-ით აჯამებს rating-ებს და რაოდენობაზე ყოფს. ცარიელი სიისთვის average=0. `average.toFixed(1)` მხოლოდ ჩვენებისთვის აბრუნებს ერთათწილადიან სტრიქონს.

მეორე `useEffect`, `[reviews]` დამოკიდებულებით, `JSON.stringify`-ით ინახავს ყველა შეფასებას `tech-store-reviews-v1` გასაღებში. წარმატება storageError-ს ასუფთავებს, `catch` კი ქართულ შეცდომას აჩვენებს.

მესამე `useEffect`, `[latestId]` დამოკიდებულებით, ახალ კომენტარზე `scrollIntoView({ behavior: 'smooth', block: 'nearest' })`-ს იძახებს. DOM რენდერის შემდეგ უკვე მზად არის. `?.` ამოწმებს როგორც ელემენტის, ისე მეთოდის არსებობას. ამ სამ effect-ს განმეორებადი listener ან ტაიმერი არ შეუქმნია, ამიტომ მათი cleanup საჭირო არ არის.

## ყველა ჩვეულებრივი და callback ფუნქცია

### `handleChange(field, value)`

`setValues(current => ({ ...current, [field]: value }))` იღებს ბოლო ფორმას, ქმნის ახალ ობიექტს და ცვლის მხოლოდ დასახელებულ ველს. `[field]` გამოთვლილი ობიექტის გასაღებია, Hook-ის dependency array არ არის. useCallback-ის დამოკიდებულებებია `[]`.

### `handleSubmit(event)`

1. `preventDefault` აჩერებს ფორმის ბრაუზერულ გაგზავნას.
2. `validate(values)` აახლებს შეცდომების სიას და აბრუნებს წარმატების ლოგიკურ პასუხს.
3. წარუმატებლობისას ფოკუსი გადადის სახელის ველზე და ფუნქცია წყდება. კოდი კონკრეტულად პირველ არასწორ ველს არ ეძებს: ყოველთვის nameRef გამოიყენება.
4. წარმატებისას `crypto.randomUUID()` ქმნის ID-ს, ტექსტებს `trim()` ასუფთავებს, `new Date().toISOString()` ქმნის თარიღს.
5. `setReviews(current => [...current, review])` სიაში ამატებს ახალ ჩანაწერს.
6. latestId იწყებს გადახვევის effect-ს; emptyForm ასუფთავებს ფორმას; resetErrors შლის შეცდომებს; notify აჩვენებს წარმატებას.

დამოკიდებულებებია `[values, productId, validate, resetErrors, notify]`. ამიტომ ფუნქცია განახლებულ ფორმასა და პროდუქტს ხედავს და ძველ მონაცემზე არ რჩება.

### `handleProductChange(nextId)`

ცვლის არჩეულ პროდუქტს, ასუფთავებს ფორმასა და შეცდომებს და latestId-ს null-ზე აბრუნებს. ეს აჩერებს სხვა პროდუქტისთვის ახალი კომენტარის ნიშნის ჩვენებას. დამოკიდებულება: `[resetErrors]`.

## `validateReview(values)` და `useFormValidation()`

`validateReview` ჩვეულებრივი სუფთა ფუნქციაა: იღებს values-ს და აბრუნებს errors ობიექტს. სახელი trim-ის შემდეგ უნდა შეიცავდეს 2–40 სიმბოლოს, კომენტარი — 10–500-ს, რეიტინგი უნდა იყოს მთელი რიცხვი 1-დან 5-მდე. რეიტინგის პირობას ამოწმებს `Number.isInteger`. შეცდომები ინახება შესაბამის გასაღებებში: author, text, rating. შეცდომის გარეშე ბრუნდება `{}`.

`useFormValidation` არის Custom Hook. `useState({})` ინახავს errors-ს. `validate(values)` useCallback-ით იძახებს validateReview-ს, ინახავს შედეგს და `Object.keys(nextErrors).length === 0`-ით აბრუნებს true/false-ს. `resetErrors()` სხვა useCallback-ია, რომელიც errors-ს `{}`-ით ცვლის. ორივეს აქვს `[]` დამოკიდებულებები. Hook აბრუნებს `{ errors, validate, resetErrors }`-ს.

`maxLength` ველში აკრეფის ზღვარს ადგენს, მაგრამ validateReview ცალკე ამოწმებს იმავე წესებს — ფორმის სწორი ქცევა მარტო HTML ატრიბუტებზე არ არის დამოკიდებული.

## `initialReviews` და `isReviews(value)`

initialReviews არის სამი საწყისი მაგალითი. isReviews ამოწმებს მასივს, ID-ების უნიკალურობას, ველების ტიპებს, პროდუქტის რიცხვით ID-სა და არსებობას, ტექსტის სიგრძეებს, რეიტინგის დიაპაზონს და თარიღის ვარგისიანობას. `Number.isNaN(Date.parse(review.date))` ადგენს, შეიძლება თუ არა თარიღის წაკითხვა. ეს validator გამოიყენება შენახული მონაცემის აღდგენისას და განსხვავდება ახალი ფორმის შეცდომების ტექსტის შემქმნელი validateReview-ისგან.

## ყველა კომპონენტი და inline მოვლენა

| ფუნქცია / კომპონენტი | ახსნა |
| --- | --- |
| `ReviewSection()` | მართავს პროდუქტის არჩევას, ფორმას, სიასა და საშუალოს. |
| პროდუქტის select-ის `onChange` | `Number(event.target.value)`-ს გადასცემს handleProductChange-ს. |
| `ReviewForm(...)` | აჩვენებს სახელს, StarRating-ს, კომენტარს და შეცდომებს. |
| სახელის `onChange` | იძახებს `onChange('author', event.target.value)`-ს. |
| ტექსტის `onChange` | იძახებს `onChange('text', event.target.value)`-ს. |
| StarRating-ის callback | `onChange('rating', rating)` მნიშვნელობას საერთო ფორმაში წერს. |
| `StarRating({ value, onChange, error })` | `.map`-ით ქმნის ხუთ ღილაკს; დაჭერისას `onChange(rating)` სრულდება. memo გარს აკრავს კომპონენტს. |
| `ReviewList(...)` | აჩვენებს ცარიელ შეტყობინებას ან ReviewCard-ებს; მხოლოდ ახალს გადასცემს scrollRef-ს. |
| `ReviewCard(...)` | აჩვენებს ავტორს, შეფასებას, კომენტარსა და თარიღს. ახალი ჩანაწერისას განსხვავებული კლასი და ნიშანი ემატება. |

`rating <= value` ავსებს არჩეულ ქულამდე ვარსკვლავებს; `aria-pressed` მხოლოდ ზუსტად არჩეულ ღილაკზეა true. ReviewCard-ში `'★'.repeat(rating)` და `'☆'.repeat(5-rating)` ქმნის სტატიკურ ვარსკვლავებს. `Intl.DateTimeFormat('ka-GE')` თარიღს ქართულ ლოკალზე აჩვენებს.

ReviewForm-ში StarRating-ის callback inline იქმნება: ეს ნიშნავს, რომ memo ყოველთვის ვერ გამოტოვებს ხელახალ რენდერს. useCallback-ის მოთხოვნა რეალურად სრულდება handleSubmit-სა და სხვა დასახელებულ ფუნქციებში.

ReviewForm-ის props აღწერს values/errors shape-ს, მოქმედების func-სა და ref-ის current ველს. StarRating-ის value number-ია, onChange func-ია, error სურვილისამებრ string-ია. ReviewList და ReviewCard იყენებს reviewType-ს. ჩვეულებრივი JSX ტექსტი React-ის მიერ უსაფრთხოდ რენდერდება; მომხმარებლის კომენტარი HTML-ად არ ინტერპრეტირდება.

## წარდგენის მაგალითი

ჯერ გაგზავნე ცარიელი ფორმა — სამი ქართული შეცდომა გამოჩნდება. შეავსე სახელი და 10-ზე მეტი სიმბოლოს კომენტარი, აირჩიე 3 ვარსკვლავი და გაგზავნე. პირველი პროდუქტის საწყისი 5 და 4 ქულას დაემატება 3; საშუალო გახდება `(5+4+3)/3 = 4.0`. გამოჩნდება ახალი კომენტარი, მოხდება scroll და ფორმა განულდება. პროდუქტის შეცვლა სხვა პროდუქტის შეფასებებს აჩვენებს.


## React-ის ექვსი Hook — რა აკეთებს თითოეული

| Hook | დანიშნულება | მნიშვნელოვანი განსხვავება |
| --- | --- | --- |
| `useState(initialValue)` | ინახავს კომპონენტის მდგომარეობას და აბრუნებს `[value, setValue]`-ს. Setter-ის გამოძახების შემდეგ React გეგმავს განახლებას. | ახალი მნიშვნელობა იმავე ფუნქციის უკვე მიმდინარე შესრულებაში ძველ ცვლადს მაშინვე არ ცვლის. |
| `useEffect(callback, dependencies)` | რენდერის შემდეგ ასრულებს გვერდით მოქმედებას: ჩატვირთვას, შენახვას, ფოკუსს ან გადახვევას. | თუ აბრუნებს cleanup ფუნქციას, React მას შემდეგი effect-ის წინ და კომპონენტის მოხსნისას ასრულებს. |
| `useContext(StoreContext)` | იღებს უახლოესი Provider-ის საერთო მონაცემებსა და მოქმედებებს. | ეს მონაცემების ასლი ან ცალკე კალათა არ არის; ყველა მოდული ერთსა და იმავე Provider-ს იყენებს. |
| `useRef(null)` | ინახავს სტაბილურ ობიექტს, რომლის `current` ველი შეიძლება DOM ელემენტს ან სხვა მნიშვნელობას მიუთითებდეს. | `current`-ის შეცვლა თავისთავად ხელახალ რენდერს არ იწყებს. |
| `useMemo(calculation, dependencies)` | დამოკიდებულებების უცვლელობისას ადრე გამოთვლილ შედეგს ხელახლა იყენებს. | ეს წარმადობის ოპტიმიზაციაა; აპლიკაციის სისწორე ქეშზე არ უნდა იყოს დამოკიდებული. |
| `useCallback(fn, dependencies)` | დამოკიდებულებების უცვლელობისას ფუნქციის იგივე მითითებას აბრუნებს. | ფუნქციას ავტომატურად არ ასრულებს და კომპონენტის ყველა რენდერს არ აჩერებს. |

`[]` ნიშნავს, რომ effect დამოკიდებული არ არის ცვლილებად მნიშვნელობებზე. ჩვეულებრივ მისი setup კომპონენტის დამონტაჟებისას სრულდება. პროექტში `StrictMode` განვითარების რეჟიმში setup/cleanup-ს დამატებითაც ამოწმებს, ამიტომ „ზუსტად ერთხელ ნებისმიერ პირობებში“ სწორი ახსნა არ არის. `[search]` ნიშნავს ხელახლა შესრულებას, როცა `search` შეიცვლება. React დამოკიდებულებებს `Object.is`-ით ადარებს.

Hook-ები გამოძახებულია კომპონენტის ან Custom Hook-ის ზედა დონეზე. ისინი არ არის მოთავსებული `if`-ში, ციკლში ან ღილაკის callback-ში. დამატებითი React Hook არ გამოიყენება. `memo`, `createContext`, `StrictMode`, `createRoot` და Vite-ის `import.meta.glob` Hook-ები არ არის.

### მდგომარეობის უსაფრთხო განახლება

`setCart(current => ...)` და `setValues(current => ...)` იღებს ბოლო მდგომარეობას. Spread ოპერატორი (`...`) ახალ მასივს ან ობიექტს ქმნის; ძველი მდგომარეობა პირდაპირ არ იცვლება. Setter-ები React-ის მიერ მოცემული ფუნქციებია, ჩვენი ცალკე აღწერილი ჩვეულებრივი ფუნქციები არ არის.

## საერთო ინფრასტრუქტურა — ყველა სტუდენტისთვის აუცილებელი ახსნა

### `main.jsx`, `App.jsx` და მოდულების შეერთება

`createRoot(document.getElementById('root')).render(...)` პოულობს HTML-ის კონტეინერს და მასში აჩვენებს React აპლიკაციას. `StoreProvider` გარს აკრავს `App`-ს, რათა ყველა ქვემდებარე კომპონენტს საერთო მონაცემები ჰქონდეს. `StrictMode` განვითარებისას ეხმარება გვერდითი მოქმედებების ხარვეზების გამოვლენას.

`App()` იყენებს `useState`-ს აქტიური განყოფილების `order`-ის შესანახად. `setActive` ნავიგაციის ღილაკიდან ცვლის აქტიურ განყოფილებას. `import.meta.glob('./components/student*/index.jsx', { eager: true })` Vite-ის დროს პოულობს მხოლოდ არსებულ სტუდენტურ მოდულებს. `Object.values` იღებს მოდულების ობიექტის მნიშვნელობებს, `.sort` აწყობს მათ `moduleInfo.order`-ით, `.find` პოულობს აქტიურს. `selected.default` არის საჩვენებელი კომპონენტი და `<Module />` მას რენდერავს.

ეს მექანიზმი ინდივიდუალურ პაკეტში ერთ განყოფილებას აჩვენებს, საერთო პროექტში — ოთხს. მოდულის კოდი არ იცვლება. განყოფილების შეცვლისას მისი ადგილობრივი ფილტრები შეიძლება განულდეს, ხოლო Provider-ის კალათა/რჩეულები და შენახული მიმოხილვები არ იკარგება.

### `StoreContext.jsx` — ყველა დასახელებული ფუნქცია

| ფუნქცია / მნიშვნელობა | რას აკეთებს |
| --- | --- |
| `createContext(null)` | ქმნის საერთო კონტექსტს. `null` საწყისი მნიშვნელობაა; ამ აპში მომხმარებელი კომპონენტები ყოველთვის Provider-ის შიგნითაა. |
| `StoreProvider({ children })` | ქმნის კალათის, რჩეულების, ვალუტისა და შეტყობინების საერთო მდგომარეობას და children-ს ამ გარემოში აჩვენებს. |
| `notify(message)` | ინახავს ქართულ შეტყობინებას და ზრდის `noticeTick`-ს. ერთნაირი შეტყობინების განმეორებაც ხელახლა იწყებს დამალვის ტაიმერს. |
| შეტყობინების effect | `setTimeout`-ით დაახლოებით 3 წამში ასუფთავებს შეტყობინებას. `clearTimeout` cleanup-ში ძველ ტაიმერს აუქმებს. დამოკიდებულებებია `[notice, noticeTick]`. |
| `addToCart(product)` | ამოწმებს პროდუქტს. არსებული ჩანაწერის რაოდენობას ზრდის მაქსიმუმ მარაგამდე; ახალი პროდუქტისთვის ქმნის `{ productId, quantity: 1 }` ჩანაწერს. აგზავნის შეტყობინებას. |
| `updateQuantity(productId, quantity)` | ამოწმებს პროდუქტსა და მთელ რიცხვს. `Math.max` და `Math.min` რაოდენობას 1-სა და მარაგის ზღვარს შორის აქცევს. `.map` ცვლის მხოლოდ შესაბამის ჩანაწერს. |
| `removeFromCart(productId)` | `.filter`-ით იღებს სიიდან ამ პროდუქტს და აჩვენებს შეტყობინებას. |
| `toggleFavorite(productId)` | თუ ID უკვე არის სიაში, შლის; წინააღმდეგ შემთხვევაში ამატებს. `.includes` ამოწმებს არსებობას, `.filter` შლის, spread ამატებს ახალ მასივში. |
| `clearCart()` | კალათას ცარიელი მასივით ანაცვლებს. |
| `formatPrice(price)` | დოლარის რეჟიმში ლარის თანხას ყოფს 2.7-ზე. `Intl.NumberFormat('ka-GE')` აჩვენებს ორ ათწილადს; ემატება ₾ ან $. კურსი სასწავლო ფიქსირებულია. |
| `value`-ის `useMemo` | ქმნის კონტექსტის ობიექტს; მისი მითითება შენარჩუნებულია, სანამ ჩამოთვლილი მონაცემები/ფუნქციები არ შეიცვლება. |

`addToCart`, `updateQuantity`, `removeFromCart`, `toggleFavorite`, `clearCart` არის `useCallback`-ით შექმნილი მოქმედებები. მათ დამოკიდებულებებში შესაბამისი Setter-ები და `notify` წერია. `formatPrice` დამოკიდებულია `[currency]`-ზე, ამიტომ ვალუტის ცვლილება ფასის ახალი ფორმატირების ფუნქციას ქმნის.

კალათის და რჩეულების მდგომარეობისთვის Provider იყენებს სტუდენტი 2-ის `useLocalStorage` Hook-ს. ამ Hook-ის შიდა `useState` ინახავს ნივთების სიას; შიდა `useEffect` ინახავს მას ბრაუზერში. შესაბამისად კალათის ნივთებს ნამდვილად მართავს `useState`, მიუხედავად იმისა, რომ ეს Hook-ის შიგნით ჩანს და არა უშუალოდ `CartModule`-ის პირველ ხაზებში.

### `useLocalStorage(key, initialValue, validate)` — საერთო დამოკიდებულება

ეს Custom Hook სტუდენტი 2-ის ნაწილია, მაგრამ Provider-ის დამოკიდებულების გამო უცვლელი ასლი ყველა ინდივიდუალურ პაკეტშიც აუცილებელია.

1. `useState(() => readStoredValue(...))` საწყის მდგომარეობას შენახული მონაცემიდან იღებს. ფუნქციის გადაცემა lazy initialization-ია; კითხვა ყოველი ჩვეულებრივი რენდერისას არ მეორდება.
2. მეორე `useState` ინახავს `storageError`-ს.
3. `useEffect`, დამოკიდებულებებით `[key, value]`, `JSON.stringify`-ით მონაცემს ტექსტად აქცევს და `localStorage.setItem`-ით ინახავს.
4. წარმატებისას შეცდომა იშლება; `catch`-ში ჩნდება ქართული შეტყობინება. მეხსიერებაში მიმდინარე მდგომარეობა მაინც მუშაობს.
5. ბრუნდება `[value, setValue, storageError]`. თითოეულ გამოძახებას დამოუკიდებელი მდგომარეობა აქვს.

ეს Hook არ უსმენს `storage` მოვლენას, არ სინქრონდება სხვა კომპიუტერთან და `key`-ის შეცვლისას თავიდან არ კითხულობს სხვა შენახულ სიას. პროექტში გასაღებები ფიქსირებულია, ამიტომ ეს გამოყენებას არ უშლის ხელს.

### `utils/products.js` და `utils/storage.js`

| ფუნქცია / მნიშვნელობა | ახსნა |
| --- | --- |
| `products` | რვა პროდუქტის მასივია; თითოეულს აქვს ID, სახელი, კატეგორია, ფასი, ძველი ფასი, სიმბოლო, აღწერა და მარაგი. საწყისი ფასები ლარშია. |
| `categories` | `.map` იღებს კატეგორიებს; `new Set` შლის გამეორებებს; spread კვლავ მასივს ქმნის. |
| `getProduct(id)` | `Number(id)`-ით გარდაქმნილი ID-ის მიხედვით `.find` აბრუნებს პროდუქტს ან `undefined`-ს. |
| `loadProducts(signal)` | აბრუნებს `Promise`-ს, რომელიც დაახლოებით 400 მილიწამში ლოკალურ პროდუქტებს აბრუნებს. აქ ქსელური `fetch` არ სრულდება — ჩატვირთვა სიმულაციურია. |
| `loadProducts`-ის `abort()` | აუქმებს ტაიმერს, შლის abort listener-ს და `reject`-ით აბრუნებს `AbortError`-ს. listener-იც იშლება წარმატებისას. |
| `readStoredValue(key, fallback, validate)` | კითხულობს `localStorage.getItem`-ს და `JSON.parse`-ით აღადგენს მონაცემს. `null`, არასწორი სტრუქტურა ან გამონაკლისი იწვევს fallback-ის დაბრუნებას. საწყისი validator `() => true` დამატებითი პირობების არქონას ნიშნავს. |
| `isCart(value)` | ამოწმებს მასივს, უნიკალურ ID-ებს, არსებულ პროდუქტებს, რიცხვით ID-ს და 1-დან მარაგამდე მთელ რაოდენობას. |
| `isFavorites(value)` | ამოწმებს მასივს, ID-ების უნიკალურობას და პროდუქტების არსებობას. |
| `isCoupon(value)` | დასაშვებია მხოლოდ ცარიელი სტრიქონი ან `სწავლა10`. |

`Array.isArray` ამოწმებს მასივს; `.every` მოითხოვს, რომ ყველა ელემენტი პირობას აკმაყოფილებდეს; `Set.size` გამოიყენება გამეორებების დასაფიქსირებლად; `Number.isInteger` მთელ რიცხვს ამოწმებს. `&&`-ის მოკლე შეფასება ხელს უშლის არასწორი მონაცემის შემდგომი ველების უადგილოდ წაკითხვას. `try/catch` მართავს დაზიანებულ JSON-სა და ბრაუზერის შენახვის შეზღუდვებს.

### `Header()` და `Panel({ title, description, children })`

`Header` იღებს საერთო პროდუქტებს, კალათას, რჩეულებსა და მოქმედებებს `useContext`-ით. საკუთარი `useState` ინახავს სწრაფი არჩევის `productId`-ს. `.reduce` ითვლის კალათის ერთეულების რაოდენობას. ვალუტის `onChange` იძახებს `setCurrency`; პროდუქტის `onChange` — `setProductId(Number(...))`; ღილაკები — `addToCart(product)` და `toggleFavorite(product.id)`.

`Panel` აჩვენებს სათაურსა და სურვილისამებრ აღწერას, შემდეგ `children`-ს. `<Panel>...</Panel>`-ის შიდა JSX გადაეცემა ამ prop-ით: ეს კომპონენტების კომპოზიციაა. `description && ...` არის prop-ზე დამოკიდებული პირობითი ჩვენება.

## Props, JSX, მოვლენები და ვალიდაცია

Props მშობლიდან შვილს გადასცემს მონაცემებსა და ფუნქციებს. შვილი საკუთარ props-ს პირდაპირ არ ცვლის; საჭირო მოქმედებისთვის მშობლის callback-ს იძახებს. `onClick={() => onAdd(product)}` ქმნის მოვლენის დამმუშავებელს; `onClick={onAdd(product)}` კი ფუნქციას რენდერისას გაუშვებდა და აქ არ გამოიყენება.

`value` და `onChange` ქმნის კონტროლირებად ველს: ველის ტექსტი React-ის მდგომარეობიდან მოდის, მოვლენა კი ამ მდგომარეობას ცვლის. `event.target.value` არის შეყვანილი მნიშვნელობა. `preventDefault()` ფორმის გაგზავნისას გვერდის გადატვირთვას აჩერებს. `noValidate` ბრაუზერის ავტომატური ფორმის ვალიდაციის ნაცვლად ჩვენს ლოგიკას აძლევს მართვას.

`className` JSX-ში CSS კლასია; `{expression}` გამოთვლილ მნიშვნელობას აჩვენებს; `<>...</>` Fragment-ია დამატებითი DOM კონტეინერის გარეშე. `.map`-ით შექმნილ კომპონენტებს აქვთ სტაბილური `key`, რათა React-მა ჩანაწერები ერთმანეთისგან გაარჩიოს. `key` შვილს ჩვეულებრივ prop-ად არ გადაეცემა.

`&&` პირობის შესრულებისას JSX-ს აჩვენებს; `condition ? a : b` ორ ვარიანტს შორის არჩევს. `?.` უსაფრთხოდ წვდება მნიშვნელობას, თუ ის არსებობს. `ref={someRef}` დამონტაჟების შემდეგ DOM ელემენტს `someRef.current`-ში ათავსებს.

`aria-label` აღწერს ღილაკის მოქმედებას; `aria-pressed` მის არჩევის მდგომარეობას; `aria-invalid` ველის შეცდომას; `aria-describedby` დამხმარე ან შეცდომის ტექსტს აკავშირებს; `role="alert"` და `role="status"` შეტყობინებებს დამხმარე ტექნოლოგიებს აწვდის. ეს ატრიბუტები თვითონ ვალიდაციას არ ასრულებს.

`PropTypes` ამოწმებს კომპონენტისთვის გადაცემული props-ის ტიპებს განვითარების რეჟიმში. `shape` აღწერს ობიექტის ველებს, `arrayOf` — მასივის ელემენტებს, `func` — ფუნქციას, `node` — რენდერებად children-ს, `isRequired` — აუცილებლობას. საერთო ტიპებია `productType`, `cartItemType`, `reviewType`. ტიპის დარღვევა გაფრთხილებაა და მონაცემების სერვერული დაცვა არ არის. პროექტის React 18.3.1 ვერსია შენარჩუნებულია ავტომატური PropTypes შემოწმებისთვის.

`memo(Component)` props-ის ზედაპირული შედარებით შეიძლება გამოტოვებდეს ხელახალ რენდერს. ახალი ობიექტი ან inline callback შედარებისთვის შეცვლილ prop-ად ითვლება, ამიტომ `memo` ყოველთვის გამოტოვებას არ ნიშნავს.

## გამოყენებული JavaScript მეთოდების მოკლე ლექსიკონი

| მეთოდი / API | ამ პროექტში გამოყენება |
| --- | --- |
| `.map(callback)` | სიიდან ქმნის ახალ სიას ან JSX ბარათებს. |
| `.filter(callback)` | ტოვებს მხოლოდ შესაბამის პროდუქტებს/ჩანაწერებს. |
| `.find(callback)` | პოულობს პირველ შესაბამის ჩანაწერს. |
| `.includes(value)` | ამოწმებს ID-ის ან ტექსტის არსებობას. |
| `.reduce(callback, 0)` | აჯამებს ფასებს, რაოდენობებს ან ქულებს. |
| `.sort(comparator)` | ალაგებს მასივს; იცვლის იმ მასივს, რომელზეც იძახება, ამიტომ გამოყენებულია ახალი გაფილტრული ან დაკოპირებული მასივი. |
| `.trim()` | შლის ტექსტის კიდეების გამოტოვებებს. |
| `.toLocaleLowerCase('ka-GE')` | ტექსტს პატარა ასოებზე გადაჰყავს შედარებისთვის. |
| `.localeCompare(other, 'ka')` | სახელების ქართული ლოკალით დალაგებას ემსახურება. |
| `Object.keys`, `Object.values` | იღებს ობიექტის გასაღებებს ან მნიშვნელობებს. |
| `JSON.parse`, `JSON.stringify` | ტექსტსა და JavaScript მონაცემს ერთმანეთში გარდაქმნის. |
| `setTimeout`, `clearTimeout` | დაყოვნება და მისი გაუქმება. |
| `Math.min`, `Math.max`, `Math.round` | საზღვრები და თანხის დამრგვალება. |
| `Number`, `Boolean` | რიცხვად ან ლოგიკურ მნიშვნელობად გარდაქმნა. |
| `Date.parse`, `new Date`, `.toISOString()` | თარიღის შედარება, ახალი თარიღი და შესანახი ISO ფორმატი. |
| `Intl.NumberFormat`, `Intl.DateTimeFormat` | თანხისა და თარიღის ლოკალური ჩვენება. |
| `crypto.randomUUID()` | ახალი მიმოხილვის უნიკალური ID. |
| `.focus()`, `.scrollIntoView()` | DOM ელემენტზე ფოკუსი ან მის ხილულ ზონაში გადახვევა. |
| `.toFixed(1)`, `.repeat(n)` | საშუალოს ერთი ათწილადი და ვარსკვლავების სტრიქონი. |

## კონფიგურაცია, სტილები და ტესტები

`package.json` განსაზღვრავს დამოკიდებულებებს და `dev`, `build`, `preview`, `test` სკრიპტებს. `package-lock.json` ზუსტ ინსტალაციას აფიქსირებს; `npm ci` მის მიხედვით აყენებს პაკეტებს. `vite.config.js`-ის `defineConfig` ადგენს React plugin-ს, შედარებით მისამართებს (`base: './'`) და ტესტების jsdom გარემოს. `react()` plugin-ის კონფიგურაციის ფუნქციაა და React Hook არ არის.

`index.html`-ში `lang="ka"` ნიშნავს ქართულ გვერდს; `#root` React-ის კონტეინერია; module script ტვირთავს `main.jsx`-ს. `styles.css` საერთო სტილებია. ინდივიდუალური CSS გამოიყენებს საკუთარ პრეფიქსს, რათა სხვა მოდულის სტილებს არ შეეჯახოს. Grid/Flex განალაგებს ბარათებს, `@media` პატარა ეკრანს ერგება, `:focus-visible` კლავიატურით ფოკუსს აჩვენებს.

ტესტის `renderInStore(component)` აჩვენებს კომპონენტს `StrictMode`-ისა და `StoreProvider`-ის შიგნით. `beforeEach` ასუფთავებს localStorage-ს; `afterEach` იძახებს `cleanup`-სა და `vi.restoreAllMocks`-ს. `describe` აჯგუფებს ტესტებს, `it` ადგენს სცენარს, `expect` ამოწმებს შედეგს. `screen`/`within` პოულობს ელემენტებს; `userEvent.setup`, `.type`, `.click`, `.selectOptions`, `.clear` მომხმარებლის მოქმედებებს ასრულებს; `findBy...` და `waitFor` ელოდება ასინქრონულ ცვლილებებს. `vi.fn` და `vi.spyOn` გამოსაცდელად ფუნქციის გამოძახებას აფიქსირებს ან ქცევას ანაცვლებს. ისინი სატესტო ხელსაწყოებია და პროდუქტის ლოგიკაში არ გამოიყენება.

გაშვება ინდივიდუალური ან სრული პროექტის საქაღალდეში:

```bash
npm ci
npm test
npm run build
npm run dev
```

სატესტო შეკვეთა თანხას არ ჩამოჭრის. GitHub-ში თქვენი პირადი სამუშაოს ისტორია თავად უნდა შექმნათ. ამ ახსნის ტექსტი კოდის შესწავლას ემსახურება და თქვენი პირადი განხორციელების მტკიცებულებას არ ანაცვლებს.

## დანართი — შენი მოდულის ზუსტად იგივე სრული წყარო

ქვემოთ მოცემული კოდი უცვლელად ემთხვევა ZIP-ის წყაროს. ზემოთ აღწერილია თითოეული ფუნქცია, მოვლენა და Hook; ეს დანართი მათ კოდთან დაკავშირებას ამარტივებს.

### `src/components/student3/index.jsx`

```jsx
// ავტორი: სტუდენტი 3 — მიმოხილვები და რეიტინგი.
import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StoreContext } from '../../context/StoreContext';
import { readStoredValue } from '../../utils/storage';
import { initialReviews, isReviews } from '../../utils/reviews';
import { productType, reviewType } from '../../utils/propTypes';
import useFormValidation from '../../hooks/student3/useFormValidation';
import Panel from '../shared/Panel';
import './reviews.css';

export const moduleInfo = { order: 3, title: 'მიმოხილვები', student: 'სტუდენტი 3' };
const emptyForm = { author: '', text: '', rating: 0 };

export default function ReviewSection() {
  const { products, notify } = useContext(StoreContext);
  const [productId, setProductId] = useState(products[0].id);
  const [reviews, setReviews] = useState(() => readStoredValue('tech-store-reviews-v1', initialReviews, isReviews));
  const [values, setValues] = useState(emptyForm);
  const [average, setAverage] = useState(0);
  const [latestId, setLatestId] = useState(null);
  const [storageError, setStorageError] = useState('');
  const latestReviewRef = useRef(null);
  const nameRef = useRef(null);
  const { errors, validate, resetErrors } = useFormValidation();

  const visibleReviews = useMemo(() => reviews.filter((review) => review.productId === productId)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date)), [reviews, productId]);

  useEffect(() => {
    const total = visibleReviews.reduce((sum, review) => sum + review.rating, 0);
    setAverage(visibleReviews.length ? total / visibleReviews.length : 0);
  }, [visibleReviews]);

  useEffect(() => {
    try {
      localStorage.setItem('tech-store-reviews-v1', JSON.stringify(reviews));
      setStorageError('');
    } catch {
      setStorageError('მიმოხილვის შენახვა მიუწვდომელია. გვერდის განახლებამდე ის სიაში დარჩება.');
    }
  }, [reviews]);

  useEffect(() => {
    if (latestId) latestReviewRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
  }, [latestId]);

  const handleChange = useCallback((field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    if (!validate(values)) {
      nameRef.current?.focus();
      return;
    }
    const review = {
      id: crypto.randomUUID(), productId, author: values.author.trim(),
      text: values.text.trim(), rating: values.rating, date: new Date().toISOString(),
    };
    setReviews((current) => [...current, review]);
    setLatestId(review.id);
    setValues(emptyForm);
    resetErrors();
    notify('შენი მიმოხილვა დაემატა.');
  }, [values, productId, validate, resetErrors, notify]);

  const handleProductChange = useCallback((nextId) => {
    setProductId(nextId);
    setValues(emptyForm);
    resetErrors();
    setLatestId(null);
  }, [resetErrors]);

  return <Panel title="მომხმარებლის მიმოხილვები" description="აირჩიე პროდუქტი და გაუზიარე სხვებს შენი შეფასება.">
    {storageError && <p role="alert" className="error-text">{storageError}</p>}
    <div className="toolbar"><label className="grow">შესაფასებელი პროდუქტი<select value={productId}
      onChange={(event) => handleProductChange(Number(event.target.value))}>
      {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
    </select></label><div className="reviews-average" role="status">
      <strong>{average.toFixed(1)} / 5</strong><span>{visibleReviews.length} მიმოხილვა</span>
    </div></div>
    <div className="reviews-layout">
      <ReviewForm values={values} errors={errors} onChange={handleChange} onSubmit={handleSubmit} nameRef={nameRef} />
      <ReviewList reviews={visibleReviews} latestId={latestId} latestReviewRef={latestReviewRef}
        product={products.find((product) => product.id === productId)} />
    </div>
  </Panel>;
}

ReviewSection.propTypes = {};

export function ReviewForm({ values, errors, onChange, onSubmit, nameRef }) {
  return <form className="reviews-form" onSubmit={onSubmit} noValidate>
    <h3>დატოვე მიმოხილვა</h3>
    <label>შენი სახელი<input ref={nameRef} value={values.author} maxLength={40}
      aria-invalid={Boolean(errors.author)} aria-describedby={errors.author ? 'review-author-error' : undefined}
      onChange={(event) => onChange('author', event.target.value)} /></label>
    {errors.author && <p id="review-author-error" role="alert" className="error-text">{errors.author}</p>}
    <StarRating value={values.rating} onChange={(rating) => onChange('rating', rating)} error={errors.rating} />
    <label>შენი მიმოხილვა<textarea rows={5} maxLength={500} value={values.text}
      aria-invalid={Boolean(errors.text)} aria-describedby={errors.text ? 'review-text-error' : 'review-text-help'}
      onChange={(event) => onChange('text', event.target.value)} /></label>
    <p id="review-text-help" className="muted">მინიმუმ 10, მაქსიმუმ 500 სიმბოლო.</p>
    {errors.text && <p id="review-text-error" role="alert" className="error-text">{errors.text}</p>}
    <button type="submit">მიმოხილვის დამატება</button>
  </form>;
}

ReviewForm.propTypes = {
  values: PropTypes.shape({ author: PropTypes.string.isRequired, text: PropTypes.string.isRequired, rating: PropTypes.number.isRequired }).isRequired,
  errors: PropTypes.shape({ author: PropTypes.string, text: PropTypes.string, rating: PropTypes.string }).isRequired,
  onChange: PropTypes.func.isRequired, onSubmit: PropTypes.func.isRequired,
  nameRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
};

export const StarRating = memo(function StarRating({ value, onChange, error }) {
  return <fieldset className="reviews-rating" aria-describedby={error ? 'review-rating-error' : undefined}>
    <legend>შეფასება ვარსკვლავებით</legend>
    <div className="reviews-stars">{[1, 2, 3, 4, 5].map((rating) => <button type="button" key={rating}
      className={rating <= value ? 'reviews-star selected' : 'reviews-star'}
      aria-label={`${rating} ვარსკვლავი`} aria-pressed={value === rating}
      onClick={() => onChange(rating)}>★</button>)}</div>
    {error && <p id="review-rating-error" role="alert" className="error-text">{error}</p>}
  </fieldset>;
});

StarRating.propTypes = { value: PropTypes.number.isRequired, onChange: PropTypes.func.isRequired, error: PropTypes.string };

export function ReviewList({ reviews, latestId, latestReviewRef, product }) {
  return <div className="reviews-list"><h3>{product.name}: შეფასებები</h3>
    {!reviews.length ? <p className="empty-state">ამ პროდუქტს ჯერ მიმოხილვა არ აქვს. იყავი პირველი!</p>
      : reviews.map((review) => <ReviewCard key={review.id} review={review}
        isNew={review.id === latestId} scrollRef={review.id === latestId ? latestReviewRef : undefined} />)}
  </div>;
}

ReviewList.propTypes = {
  reviews: PropTypes.arrayOf(reviewType).isRequired, latestId: PropTypes.string,
  latestReviewRef: PropTypes.shape({ current: PropTypes.any }).isRequired, product: productType.isRequired,
};

export function ReviewCard({ review, isNew, scrollRef }) {
  return <article ref={scrollRef} className={`reviews-card${isNew ? ' reviews-new' : ''}`}>
    <div className="reviews-card-top"><strong>{review.author}</strong>
      <span aria-label={`შეფასება: ${review.rating} ხუთიდან`} className="reviews-static-stars">
        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></div>
    <p className="reviews-comment">{review.text}</p>
    <time dateTime={review.date} className="muted">{new Intl.DateTimeFormat('ka-GE').format(new Date(review.date))}</time>
    {isNew && <span className="reviews-new-label">ახალი მიმოხილვა</span>}
  </article>;
}

ReviewCard.propTypes = {
  review: reviewType.isRequired, isNew: PropTypes.bool.isRequired,
  scrollRef: PropTypes.shape({ current: PropTypes.any }),
};
```

### `src/hooks/student3/useFormValidation.js`

```javascript
// ავტორი: სტუდენტი 3.
import { useCallback, useState } from 'react';

export function validateReview(values) {
  const errors = {};
  if (values.author.trim().length < 2) errors.author = 'სახელი მინიმუმ 2 სიმბოლოს უნდა შეიცავდეს.';
  if (values.author.trim().length > 40) errors.author = 'სახელი მაქსიმუმ 40 სიმბოლოს უნდა შეიცავდეს.';
  if (values.text.trim().length < 10) errors.text = 'მიმოხილვა მინიმუმ 10 სიმბოლოს უნდა შეიცავდეს.';
  if (values.text.trim().length > 500) errors.text = 'მიმოხილვა მაქსიმუმ 500 სიმბოლოს უნდა შეიცავდეს.';
  if (!Number.isInteger(values.rating) || values.rating < 1 || values.rating > 5) errors.rating = 'აირჩიე შეფასება 1-დან 5 ვარსკვლავამდე.';
  return errors;
}

export default function useFormValidation() {
  const [errors, setErrors] = useState({});
  const validate = useCallback((values) => {
    const nextErrors = validateReview(values);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, []);
  const resetErrors = useCallback(() => setErrors({}), []);
  return { errors, validate, resetErrors };
}
```

### `src/utils/reviews.js`

```javascript
import { getProduct } from './products';

export const initialReviews = [
  { id: 'initial-1', productId: 1, author: 'მომხმარებელი', text: 'კომფორტულია და ხმა ძალიან მომწონს.', rating: 5, date: '2026-01-10T12:00:00.000Z' },
  { id: 'initial-2', productId: 1, author: 'მყიდველი', text: 'ყოველდღიური გამოყენებისთვის კარგი არჩევანია.', rating: 4, date: '2026-01-11T12:00:00.000Z' },
  { id: 'initial-3', productId: 4, author: 'სტუდენტი', text: 'სწავლის დროს მოხერხებული და მსუბუქია.', rating: 4, date: '2026-01-12T12:00:00.000Z' },
];

export const isReviews = (value) => Array.isArray(value) &&
  new Set(value.map((review) => review?.id)).size === value.length &&
  value.every((review) => review && typeof review.id === 'string' && Number.isInteger(review.productId) && getProduct(review.productId) &&
    typeof review.author === 'string' && review.author.trim().length >= 2 && review.author.length <= 40 &&
    typeof review.text === 'string' && review.text.trim().length >= 10 && review.text.length <= 500 &&
    Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5 &&
    typeof review.date === 'string' && !Number.isNaN(Date.parse(review.date)));
```

### `src/components/student3/reviews.css`

```css
.reviews-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 24px; align-items: start; }
.reviews-form { display: grid; gap: 12px; padding: 20px; background: #f4f6fa; border-radius: 10px; }
.reviews-form h3 { margin: 0 0 6px; }
.reviews-form p { margin: 0; }
.reviews-rating { margin: 0; padding: 10px; border: 1px solid #c9d2df; border-radius: 6px; }
.reviews-stars { display: flex; gap: 6px; flex-wrap: wrap; }
.reviews-star { background: transparent; color: #687385; font-size: 28px; padding: 3px 8px; }
.reviews-star:hover, .reviews-star.selected { background: #fff0c2; color: #875800; }
.reviews-static-stars { color: #875800; }
.reviews-average { display: grid; gap: 4px; text-align: right; padding-bottom: 8px; }
.reviews-average strong { color: #285cac; font-size: 24px; }
.reviews-card { padding: 16px; border: 1px solid #dce2ea; border-radius: 8px; margin: 12px 0; }
.reviews-card-top { display: flex; gap: 12px; justify-content: space-between; flex-wrap: wrap; }
.reviews-comment { white-space: pre-wrap; overflow-wrap: anywhere; }
.reviews-new { border-color: #537bb4; background: #f4f8ff; }
.reviews-new-label { display: block; color: #285cac; font-size: 13px; margin-top: 8px; }
@media (max-width: 750px) { .reviews-layout { grid-template-columns: 1fr; } }
```

## შეფასების მოთხოვნებთან კავშირი

შედეგი 1: პირადად აჩვენე Node/npm, Vite-ის შექმნა, საქაღალდეები და JSX. შედეგი 2: ზემოთ აღწერილი ექვსივე React Hook და შენი Custom Hook. შედეგი 3: კომპონენტების იერარქია, მონაცემებისა და callback props-ის გადაცემა, children, PropTypes და პირობითი რენდერი. პროექტის მზადყოფნა პირადი წარდგენისა და რეალური Commit History-ის საჭიროებას არ აუქმებს.
