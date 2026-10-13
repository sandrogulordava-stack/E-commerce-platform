
# სტუდენტი 1 — პროდუქტების კატალოგის სრული ახსნა

თქვენი მოდულია `src/components/student1/index.jsx`, სტილია `catalog.css`, საკუთარი Hook-ია `src/hooks/student1/useDebounce.js`. ამ ფაილებში კოდი სრულ და ინდივიდუალურ პროექტებში ერთნაირია.

## მოდული და მონაცემების მოძრაობა

`moduleInfo = { order: 1, title: 'პროდუქტები', student: 'სტუდენტი 1' }` Vite-ის მიერ აღმოჩენილ მოდულს ნავიგაციაში აღწერს. `CatalogModule` მართავს კატალოგს; `ProductGrid` მართავს შედეგების ჩვენებას; `ProductCard` აჩვენებს ერთ პროდუქტს. `Panel` ამ ყველაფერს children-ით გარს აკრავს.

## თითოეული მდგომარეობა

| მნიშვნელობა და Setter | დანიშნულება |
| --- | --- |
| `products`, `setProducts` | ლოკალურად ჩატვირთული პროდუქტები; საწყისად `[]`. |
| `search`, `setSearch` | საძიებო ველის ტექსტი; საწყისად ცარიელია. |
| `category`, `setCategory` | არჩეული კატეგორია; საწყისად `ყველა`. |
| `loading`, `setLoading` | მართავს ჩატვირთვის შეტყობინებას. |
| `error`, `setError` | ჩატვირთვის შეცდომის ქართული ტექსტი. |
| `loadAttempt`, `setLoadAttempt` | განმეორებითი ჩატვირთვის მთვლელი. |

## Hook-ების ზუსტი გამოყენება

`useContext` იღებს `addToCart`, `toggleFavorite`, `favoriteIds`, `formatPrice`-ს. ახალი კალათა ამ მოდულში არ იქმნება: სტუდენტი 2 იგივე სიას ხედავს. ვალუტის შეცვლა აქაც ცვლის ფასების ჩვენებას.

`useRef(null)` ქმნის `searchRef`-ს. პირველი effect `[]` დამოკიდებულებებით იძახებს `searchRef.current?.focus()`-ს. ამდენად კატალოგის დამონტაჟებისას ტექსტის შეყვანა პირდაპირ შეიძლება.

მეორე effect `[loadAttempt]`-ზეა დამოკიდებული. ქმნის `AbortController`-ს, რთავს loading-ს, ასუფთავებს შეცდომას და იძახებს `loadProducts(controller.signal)`-ს. `.then(data => ...)` ინახავს შედეგსა და თიშავს loading-ს. `.catch(reason => ...)` ნამდვილ შეცდომას აჩვენებს, ხოლო `AbortError`-ს უგულებელყოფს. Cleanup `controller.abort()` ძველ ჩატვირთვას აუქმებს კომპონენტის მოხსნის ან განმეორებითი მცდელობისას. ეს ასევე StrictMode-ის შემოწმებას უსაფრთხოს ხდის.

`useMemo` ქმნის `filtered`-ს. დამოკიდებულებებია `[products, debouncedSearch, category]`. ყოველი პროდუქტის სახელი და დაყოვნებული საძიებო ტექსტი გადადის პატარა ასოებში; ძებნას კიდეების გამოტოვებები სცილდება; `.includes` ამოწმებს დამთხვევას. კატეგორია ან `ყველა` უნდა იყოს, ან პროდუქტის კატეგორიას უნდა ემთხვეოდეს. საჭიროა ორივე პირობის ერთდროული დაკმაყოფილება.

`useCallback` ქმნის `clearFilters()`-ს, რომელიც ტექსტს ასუფთავებს, კატეგორიას `ყველა`-ზე აბრუნებს და საძიებო ველზე ფოკუსს აღადგენს. `[]` მისაღებია, რადგან მხოლოდ სტაბილური Setter-ები და ref გამოიყენება. ძებნის დაყოვნების გამო სრული სიის დაბრუნებას მაქსიმუმ დაახლოებით 300 მილიწამი სჭირდება.

## `useDebounce(value, delay = 300)` — მთელი ლოგიკა

`debouncedValue`-ის `useState` საწყისად იღებს შემოსულ value-ს. Effect `[value, delay]` ქმნის ტაიმერს; დაყოვნების შემდეგ `setDebouncedValue(value)` აახლებს საძიებო მნიშვნელობას. თუ მომხმარებელი მანამდე კიდევ აკრეფს, cleanup აუქმებს ძველ ტაიმერს და ახალი value-ისთვის ახალი ტაიმერი იწყება. დაბრუნებული მნიშვნელობა გამოიყენება გაფილტვრაში.

მაგალითად, სწრაფად აკრეფილი „მაუსი“ ტექსტის ყოველი ასო ფილტრაციას მაშინვე არ იწყებს; ძებნის მნიშვნელობა ბოლოს აკრეფიდან დაახლოებით 300 მილიწამში ახლდება. ეს არ არის ქსელური მოთხოვნა და მონაცემს სერვერზე არ გზავნის.

## ყველა კომპონენტი და მოვლენის ფუნქცია

| ფუნქცია / callback | ახსნა |
| --- | --- |
| `CatalogModule()` | აერთიანებს მდგომარეობას, Hook-ებს, საძიებო ფორმასა და ProductGrid-ს. |
| search `onChange` | `setSearch(event.target.value)` ინახავს შეყვანილ ტექსტს. |
| category `onChange` | `setCategory(event.target.value)` ინახავს ჩამოსაშლელი სიის არჩევანს. |
| `onRetry` | `setLoadAttempt(attempt => attempt + 1)` ზრდის მთვლელს და თავიდან იწყებს ჩატვირთვის effect-ს. |
| გაფილტვრის callback | ქმნის `matchesName`-ს და ამოწმებს სახელსა და კატეგორიას. |
| `ProductGrid(...)` | ჯერ ამოწმებს loading-ს, მერე error-ს, მერე ცარიელ სიას; მხოლოდ წარმატებულ შემთხვევაში ქმნის ბარათებს. |
| `products.map` callback | თითოეულ პროდუქტს ქმნის ProductCard-ად, მის ID-ს key-ად იყენებს და ითვლის `isFavorite`-ს. |
| `ProductCard(...)` | აჩვენებს პროდუქტს, ფასებს და მოქმედების ორ ღილაკს; გარს აკრავს `memo`. |
| ბარათის დამატების callback | `onAdd(product)` გადასცემს მთლიან პროდუქტის ობიექტს Provider-ის მოქმედებას. |
| ბარათის გულის callback | `onFavorite(product.id)` გადასცემს ID-ს რჩეულის დამატებისთვის ან წაშლისთვის. |

`ProductGrid`-ის props არის პროდუქტები, loading, error, favoriteIds და ოთხი ფუნქცია: onAdd, onFavorite, formatPrice, onRetry. `ProductCard`-ს გადაეცემა ერთი პროდუქტი, `isFavorite` და მოქმედების ფუნქციები. მათი ტიპები აღწერილია `.propTypes`-ში.

`product.oldPrice > product.price` აჩვენებს ფასდაკლების ნიშანს და გადახაზულ ძველ ფასს. `isFavorite` ცვლის გულის სიმბოლოს, aria ტექსტს და `aria-pressed`-ს. სწორედ props-ის მიხედვით იცვლება შვილის UI.

## მაგალითი და წარდგენა

1. გახსნისას ჩანს „იტვირთება პროდუქტები...“, შემდეგ რვა პროდუქტი.
2. აკრიფე „ყურსასმენი“ — დაყოვნების შემდეგ რჩება შესაბამისი ბარათი.
3. აირჩიე „დამტენები“ — ერთად ორი პირობა აღარ სრულდება და ჩანს ცარიელი ძებნა.
4. გაასუფთავე ფილტრები — სია და ფოკუსი აღდგება.
5. დაამატე კალათასა და რჩეულებში — Header-ის მთვლელები იცვლება და სხვა მოდულები იმავე მონაცემს მიიღებს.

შენი ტესტი ამოწმებს ამ მოქმედებებს StrictMode-ში. საკუთარი Custom Hook-ად წარადგინე `useDebounce`; საერთო `useLocalStorage`-ს ავტორობა სტუდენტი 2-ს ეკუთვნის.


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

### `src/components/student1/index.jsx`

```jsx
// ავტორი: სტუდენტი 1 — კატალოგი და ფილტრაცია.
import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StoreContext } from '../../context/StoreContext';
import { categories, loadProducts } from '../../utils/products';
import { productType } from '../../utils/propTypes';
import Panel from '../shared/Panel';
import useDebounce from '../../hooks/student1/useDebounce';
import './catalog.css';

export const moduleInfo = { order: 1, title: 'პროდუქტები', student: 'სტუდენტი 1' };

export default function CatalogModule() {
  const { addToCart, toggleFavorite, favoriteIds, formatPrice } = useContext(StoreContext);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ყველა');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const searchRef = useRef(null);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    loadProducts(controller.signal).then((data) => {
      setProducts(data);
      setLoading(false);
    }).catch((reason) => {
      if (reason.name !== 'AbortError') {
        setError('პროდუქტების ჩატვირთვა ვერ მოხერხდა. სცადე ხელახლა.');
        setLoading(false);
      }
    });
    return () => controller.abort();
  }, [loadAttempt]);

  const filtered = useMemo(() => products.filter((product) => {
    const matchesName = product.name.toLocaleLowerCase('ka-GE').includes(debouncedSearch.trim().toLocaleLowerCase('ka-GE'));
    return matchesName && (category === 'ყველა' || product.category === category);
  }), [products, debouncedSearch, category]);

  const clearFilters = useCallback(() => {
    setSearch('');
    setCategory('ყველა');
    searchRef.current?.focus();
  }, []);

  return <Panel title="პროდუქტების კატალოგი" description="მოძებნე პროდუქტი ან აირჩიე სასურველი კატეგორია.">
    <div className="toolbar">
      <label className="grow">პროდუქტის ძებნა<input ref={searchRef} type="search" value={search}
        placeholder="მაგალითად: ყურსასმენი" onChange={(event) => setSearch(event.target.value)} /></label>
      <label>კატეგორია<select value={category} onChange={(event) => setCategory(event.target.value)}>
        <option>ყველა</option>{categories.map((name) => <option key={name}>{name}</option>)}
      </select></label>
      <button type="button" className="secondary" onClick={clearFilters}>ფილტრების გასუფთავება</button>
    </div>
    <ProductGrid products={filtered} loading={loading} error={error} favoriteIds={favoriteIds}
      onAdd={addToCart} onFavorite={toggleFavorite} formatPrice={formatPrice}
      onRetry={() => setLoadAttempt((attempt) => attempt + 1)} />
  </Panel>;
}

CatalogModule.propTypes = {};

export function ProductGrid({ products, loading, error, favoriteIds, onAdd, onFavorite, formatPrice, onRetry }) {
  if (loading) return <p className="empty-state" role="status">იტვირთება პროდუქტები...</p>;
  if (error) return <div className="empty-state"><p role="alert">{error}</p><button type="button" onClick={onRetry}>ხელახლა ცდა</button></div>;
  if (!products.length) return <p className="empty-state">პროდუქტი ვერ მოიძებნა. შეცვალე ძებნა ან კატეგორია.</p>;
  return <><p className="result-count">ნაპოვნია {products.length} პროდუქტი</p><div className="catalog-grid">
    {products.map((product) => <ProductCard key={product.id} product={product}
      isFavorite={favoriteIds.includes(product.id)} onAdd={onAdd} onFavorite={onFavorite} formatPrice={formatPrice} />)}
  </div></>;
}

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(productType).isRequired, loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired, favoriteIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  onAdd: PropTypes.func.isRequired, onFavorite: PropTypes.func.isRequired,
  formatPrice: PropTypes.func.isRequired, onRetry: PropTypes.func.isRequired,
};

export const ProductCard = memo(function ProductCard({ product, isFavorite, onAdd, onFavorite, formatPrice }) {
  return <article className="catalog-card">
    <div className="catalog-image"><span aria-hidden="true">{product.icon}</span>
      {product.oldPrice > product.price && <span className="catalog-sale">ფასდაკლება</span>}
    </div>
    <p className="muted">{product.category}</p><h3>{product.name}</h3><p>{product.description}</p>
    <div className="catalog-price"><strong>{formatPrice(product.price)}</strong>
      {product.oldPrice > product.price && <del>{formatPrice(product.oldPrice)}</del>}</div>
    <div className="catalog-actions">
      <button type="button" onClick={() => onAdd(product)}>კალათაში დამატება</button>
      <button type="button" className="secondary" aria-pressed={isFavorite}
        aria-label={`${product.name}: ${isFavorite ? 'რჩეულებიდან წაშლა' : 'რჩეულებში დამატება'}`}
        onClick={() => onFavorite(product.id)}>{isFavorite ? '♥' : '♡'}</button>
    </div>
  </article>;
});

ProductCard.propTypes = {
  product: productType.isRequired, isFavorite: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired, onFavorite: PropTypes.func.isRequired, formatPrice: PropTypes.func.isRequired,
};
```

### `src/hooks/student1/useDebounce.js`

```javascript
// ავტორი: სტუდენტი 1.
import { useEffect, useState } from 'react';

export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
```

### `src/components/student1/catalog.css`

```css
.catalog-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.catalog-card { border: 1px solid #dce2ea; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; }
.catalog-card h3 { margin: 8px 0; }
.catalog-card > p { margin: 6px 0; }
.catalog-image { position: relative; background: #edf2f9; border-radius: 8px; height: 120px; display: grid; place-items: center; }
.catalog-image > span:first-child { font-size: 56px; }
.catalog-sale { position: absolute; left: 8px; top: 8px; padding: 4px 7px; background: #dcefe2; color: #236039; border-radius: 4px; font-size: 12px; }
.catalog-price { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin: 14px 0; margin-top: auto; padding-top: 12px; }
.catalog-price del { color: #687385; font-size: 14px; }
.catalog-actions { display: flex; gap: 8px; }
.catalog-actions button:first-child { flex: 1; }
@media (max-width: 900px) { .catalog-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 580px) { .catalog-grid { grid-template-columns: 1fr; } }
```

## შეფასების მოთხოვნებთან კავშირი

შედეგი 1: პირადად აჩვენე Node/npm, Vite-ის შექმნა, საქაღალდეები და JSX. შედეგი 2: ზემოთ აღწერილი ექვსივე React Hook და შენი Custom Hook. შედეგი 3: კომპონენტების იერარქია, მონაცემებისა და callback props-ის გადაცემა, children, PropTypes და პირობითი რენდერი. პროექტის მზადყოფნა პირადი წარდგენისა და რეალური Commit History-ის საჭიროებას არ აუქმებს.
