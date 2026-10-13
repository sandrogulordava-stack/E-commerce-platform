
# სტუდენტი 4 — რჩეული პროდუქტების სრული ახსნა

თქვენი მოდულია `src/components/student4/index.jsx`, სტილია `favorites.css`, საკუთარი Hook-ია `src/hooks/student4/useFavoriteSearch.js`. რჩეულების მეოთხე მოდული დამატებულია ოთხკაციანი გუნდისთვის, იმავე საერთო კრიტერიუმებით. ინდივიდუალური მოდულის წყარო სრულ პროექტში უცვლელად გამოიყენება.

## მონაცემები და Hook-ები

`moduleInfo.order` არის 4, ამიტომ სრულ პროექტში ეს განყოფილება მეოთხეა. `useContext` იღებს products-ს, cart-ს, favoriteIds-ს, toggleFavorite-ს, addToCart-ს, formatPrice-სა და notify-ს. რჩეულებში ID-ები ინახება, სრული პროდუქტები კი საერთო პროდუქტების მასივიდან მიიღება.

`useState('')` მართავს search-ს; `useState('name')` — sort-ს. sort-ის სამი რეჟიმია `name`, `price-asc`, `price-desc`. Setter-ებს input/select-ის onChange ფუნქციები იძახებს.

`useRef(null)` ქმნის searchRef-ს. `useEffect(..., [])` დამონტაჟებისას აკეთებს ფოკუსს. იგივე ref გამოიყენება clearFilters-შიც. ref-ის შეცვლა ხელახალ რენდერს არ იწყებს.

პირველი `useMemo`, დამოკიდებულებებით `[products, favoriteIds]`, `.filter`-ით ქმნის favoriteProducts-ს: რჩება პროდუქტი, რომლის ID favoriteIds-შია. მეორე `useMemo`, `[favoriteProducts]` დამოკიდებულებით, `.reduce`-ით ითვლის ყველა რჩეულის საერთო ფასს. ჯამი არ არის მხოლოდ საძიებო შედეგების ღირებულება — მთლიან შენახულ სიას ეკუთვნის.

`useFavoriteSearch(favoriteProducts, search, sort)` ქმნის საჩვენებელ გაფილტრულ და დალაგებულ სიას. რჩეულების შენახვას საერთო Provider-ის useLocalStorage აკეთებს; თქვენი საკუთარი Hook ამ შენახვის Hook-ის ასლი არ არის.

## საკუთარი Hook-ის სრული ახსნა

`useFavoriteSearch(products, search, sort)` იყენებს სამ Hook-ს:

1. `useState(search)` ქმნის დაყოვნებული ძებნის query-ს.
2. `useEffect`, `[search]` დამოკიდებულებით, ქმნის 250 მილიწამიან ტაიმერს და მისი დასრულებისას setQuery(search)-ს იძახებს. Cleanup clearTimeout-ით ძველ ტაიმერს აუქმებს.
3. `useMemo`, `[products, query, sort]` დამოკიდებულებებით, `.filter`-ით სახელს ეძებს და დაკოპირებულ შედეგს ალაგებს.

სახელის შედარება იყენებს toLocaleLowerCase-ს, trim-სა და includes-ს. დალაგების comparator-ში `a.price - b.price` ფასს ზრდადობით ალაგებს, `b.price - a.price` — კლებადობით, `a.name.localeCompare(b.name, 'ka')` — ქართული სახელით. `[...filtered]` ქმნის ახალ მასივს, რომელსაც sort ცვლის; შემოსული products არ იცვლება. ბრუნდება სია და არა Setter ან დამატებითი ობიექტი.

## ყველა დასახელებული ფუნქცია და callback

### `clearFilters()`

შლის search-ს, sort-ს აბრუნებს `name`-ზე და ფოკუსს აბრუნებს საძიებო ველში. useCallback-ის დამოკიდებულებებია `[]`. ძებნის დაყოვნებული query შეიძლება კიდევ დაახლოებით 250 მილიწამი ძველი დარჩეს; ამის შემდეგ სია სრულად აღდგება.

### `moveToCart(product)`

`.find` ამოწმებს, არის თუ არა პროდუქტი კალათაში. თუ არსებული რაოდენობა მარაგის მაქსიმუმს აღწევს, აჩვენებს შეტყობინებას და სრულდება: პროდუქტი რჩეულებში რჩება. სხვა შემთხვევაში addToCart ამატებს ან ზრდის კალათის ჩანაწერს, toggleFavorite შლის უკვე რჩეულ პროდუქტს, notify აჩვენებს გადატანის შედეგს. დამოკიდებულებებია `[cart, addToCart, toggleFavorite, notify]`, რათა შემოწმება ბოლო კალათას ხედავდეს.

### კომპონენტები და სხვა callback-ები

| ფუნქცია / callback | ახსნა |
| --- | --- |
| `FavoritesModule()` | მართავს ძებნასა და დალაგებას, იღებს საერთო სიას, ანგარიშობს ჯამს და აჩვენებს მოდულს. |
| favoriteProducts-ის filter | ამოწმებს `favoriteIds.includes(product.id)`-ს. |
| total-ის reduce | საწყისი 0-დან ყველა რჩეული პროდუქტის ფასს ამატებს. |
| search-ის `onChange` | `setSearch(event.target.value)` ინახავს ტექსტს. |
| sort-ის `onChange` | `setSort(event.target.value)` ირჩევს დალაგების რეჟიმს. |
| `FavoritesWrapper({ isEmpty, children })` | მთლიანი რჩეულების სიის ცარიელობისას შეტყობინებას აჩვენებს; სხვა შემთხვევაში children-ს. |
| `FavoriteList({ products, ... })` | საძიებო შედეგის ცარიელობისას სხვა შეტყობინებას აჩვენებს; სხვაგვარად map-ით ქმნის ბარათებს. |
| `FavoriteCard({ product, ... })` | აჩვენებს პროდუქტის მონაცემებს და ორი მოქმედების ღილაკს; memo-შია მოქცეული. |
| გადატანის ღილაკის callback | `onMove(product)` მშობელს მთელ პროდუქტს გადასცემს. |
| წაშლის ღილაკის callback | `onRemove(product.id)` იძახებს Provider-ის toggleFavorite-ს. |

## Props, კომპოზიცია და პირობითი რენდერი

FavoriteList იღებს `products`, `onRemove`, `onMove`, `formatPrice`-ს. FavoriteCard იღებს ერთ product-ს და იმავე მოქმედებებს. ტიპებია `arrayOf(productType)`, `productType`, `func`. FavoritesWrapper იღებს bool isEmpty-ს და node children-ს. მთავარი Panel ასევე children-ით ქმნის კომპოზიციას.

მნიშვნელოვანია ორი ცარიელი შემთხვევის განსხვავება: საერთოდ არაფერი გაქვს შენახული, ან შენახული გაქვს, მაგრამ ძებნა ვერაფერს პოულობს. პირველი Wrapper-ში წყდება, მეორე — FavoriteList-ში. ფილტრი შენახულ სიას არ შლის.

შვილის ღილაკი მდგომარეობას უშუალოდ არ ცვლის. იგი onMove/onRemove callback-ით მოქმედებას მშობელს გადასცემს და საბოლოო მონაცემი Provider-ში ახლდება. ეს იგივე კალათასა და favoriteIds-ს ცვლის, რომელსაც სხვა სტუდენტების ნაწილები იყენებს.

## წარდგენის მაგალითი

სწრაფი არჩევიდან დაამატე რჩეულებში ყურსასმენი და მაუსი. საერთო ღირებულება იქნება 208 ლარი. დაალაგე დაბალი ფასიდან: 59-ლარიანი მაუსი წინ გამოჩნდება. მოძებნე ყურსასმენი; დაახლოებით 250 მილიწამში ერთი ბარათი დარჩება. გადაიტანე კალათაში — ის რჩეულებიდან გაქრება, კალათაში დაემატება, საერთო სიის ღირებულება გახდება 59 ლარი. საძიებო შედეგის ცარიელობა ამ დროს მთლიანი სიის ცარიელობა არ არის.

თქვენი ტესტი ამოწმებს ძებნას, დალაგებას, გადატანას, წაშლას და რჩეულის შენარჩუნებას მარაგის მაქსიმუმისას.


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

### `src/components/student4/index.jsx`

```jsx
// ავტორი: სტუდენტი 4 — რჩეული პროდუქტები.
import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StoreContext } from '../../context/StoreContext';
import useFavoriteSearch from '../../hooks/student4/useFavoriteSearch';
import { productType } from '../../utils/propTypes';
import Panel from '../shared/Panel';
import './favorites.css';

export const moduleInfo = { order: 4, title: 'რჩეულები', student: 'სტუდენტი 4' };

export default function FavoritesModule() {
  const { products, cart, favoriteIds, toggleFavorite, addToCart, formatPrice, notify } = useContext(StoreContext);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const searchRef = useRef(null);
  const favoriteProducts = useMemo(() => products.filter((product) => favoriteIds.includes(product.id)), [products, favoriteIds]);
  const visibleProducts = useFavoriteSearch(favoriteProducts, search, sort);
  const total = useMemo(() => favoriteProducts.reduce((sum, product) => sum + product.price, 0), [favoriteProducts]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const clearFilters = useCallback(() => {
    setSearch(''); setSort('name'); searchRef.current?.focus();
  }, []);

  const moveToCart = useCallback((product) => {
    const existing = cart.find((item) => item.productId === product.id);
    if (existing && existing.quantity >= product.stock) {
      notify('კალათაში უკვე დამატებულია მარაგის მაქსიმალური რაოდენობა. პროდუქტი რჩეულებში დარჩა.');
      return;
    }
    addToCart(product);
    toggleFavorite(product.id);
    notify('პროდუქტი გადატანილია კალათაში და ამოღებულია რჩეულებიდან.');
  }, [cart, addToCart, toggleFavorite, notify]);

  return <Panel title="რჩეული პროდუქტები" description="შეინახე სასურველი პროდუქტები და გადადე არჩევანი მოგვიანებით.">
    <div className="favorites-summary"><span>შენახულია: {favoriteProducts.length} პროდუქტი</span>
      <strong>სიის ღირებულება: {formatPrice(total)}</strong></div>
    <div className="toolbar">
      <label className="grow">რჩეულებში ძებნა<input ref={searchRef} type="search" value={search}
        placeholder="პროდუქტის სახელი" onChange={(event) => setSearch(event.target.value)} /></label>
      <label>დალაგება<select value={sort} onChange={(event) => setSort(event.target.value)}>
        <option value="name">სახელით</option><option value="price-asc">ფასი: დაბლიდან მაღლისკენ</option>
        <option value="price-desc">ფასი: მაღლიდან დაბლისკენ</option>
      </select></label>
      <button type="button" className="secondary" onClick={clearFilters}>ძებნის გასუფთავება</button>
    </div>
    <FavoritesWrapper isEmpty={!favoriteProducts.length}>
      <FavoriteList products={visibleProducts} onRemove={toggleFavorite} onMove={moveToCart} formatPrice={formatPrice} />
    </FavoritesWrapper>
  </Panel>;
}

FavoritesModule.propTypes = {};

export function FavoritesWrapper({ isEmpty, children }) {
  return isEmpty ? <p className="empty-state">რჩეულების სია ცარიელია. შეინახე პროდუქტი გულის ღილაკით ან სწრაფი არჩევიდან.</p>
    : <div className="favorites-wrapper">{children}</div>;
}

FavoritesWrapper.propTypes = { isEmpty: PropTypes.bool.isRequired, children: PropTypes.node.isRequired };

export function FavoriteList({ products, onRemove, onMove, formatPrice }) {
  if (!products.length) return <p className="empty-state">ძებნის მიხედვით რჩეული პროდუქტი ვერ მოიძებნა.</p>;
  return <div className="favorites-list">{products.map((product) => <FavoriteCard key={product.id}
    product={product} onRemove={onRemove} onMove={onMove} formatPrice={formatPrice} />)}</div>;
}

FavoriteList.propTypes = {
  products: PropTypes.arrayOf(productType).isRequired, onRemove: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired, formatPrice: PropTypes.func.isRequired,
};

export const FavoriteCard = memo(function FavoriteCard({ product, onRemove, onMove, formatPrice }) {
  return <article className="favorites-card">
    <div className="favorites-icon" aria-hidden="true">{product.icon}</div>
    <div className="grow"><p className="muted">{product.category}</p><h3>{product.name}</h3>
      <p>{product.description}</p><strong>{formatPrice(product.price)}</strong></div>
    <div className="favorites-actions"><button type="button" onClick={() => onMove(product)}>კალათაში გადატანა</button>
      <button type="button" className="secondary" aria-label={`${product.name}: რჩეულებიდან წაშლა`}
        onClick={() => onRemove(product.id)}>რჩეულებიდან წაშლა</button></div>
  </article>;
});

FavoriteCard.propTypes = {
  product: productType.isRequired, onRemove: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired, formatPrice: PropTypes.func.isRequired,
};
```

### `src/hooks/student4/useFavoriteSearch.js`

```javascript
// ავტორი: სტუდენტი 4 — ძებნის დაყოვნება და ფასით/სახელით დალაგება.
import { useEffect, useMemo, useState } from 'react';

export default function useFavoriteSearch(products, search, sort) {
  const [query, setQuery] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search), 250);
    return () => clearTimeout(timer);
  }, [search]);

  return useMemo(() => {
    const filtered = products.filter((product) => product.name.toLocaleLowerCase('ka-GE')
      .includes(query.trim().toLocaleLowerCase('ka-GE')));
    return [...filtered].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name, 'ka');
    });
  }, [products, query, sort]);
}
```

### `src/components/student4/favorites.css`

```css
.favorites-summary { background: #edf2f9; padding: 14px; border-radius: 8px; display: flex; gap: 14px; justify-content: space-between; flex-wrap: wrap; margin-bottom: 18px; }
.favorites-card { display: flex; gap: 18px; align-items: center; padding: 18px; margin: 14px 0; border: 1px solid #dce2ea; border-radius: 10px; }
.favorites-card h3 { margin: 6px 0; }
.favorites-card p { margin: 6px 0; }
.favorites-icon { font-size: 42px; padding: 20px; background: #edf2f9; border-radius: 8px; }
.favorites-actions { display: grid; gap: 10px; }
@media (max-width: 650px) { .favorites-card { flex-wrap: wrap; } .favorites-actions { width: 100%; } .favorites-icon { padding: 12px; } }
```

## შეფასების მოთხოვნებთან კავშირი

შედეგი 1: პირადად აჩვენე Node/npm, Vite-ის შექმნა, საქაღალდეები და JSX. შედეგი 2: ზემოთ აღწერილი ექვსივე React Hook და შენი Custom Hook. შედეგი 3: კომპონენტების იერარქია, მონაცემებისა და callback props-ის გადაცემა, children, PropTypes და პირობითი რენდერი. პროექტის მზადყოფნა პირადი წარდგენისა და რეალური Commit History-ის საჭიროებას არ აუქმებს.
