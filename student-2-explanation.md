
# სტუდენტი 2 — საყიდლების კალათის სრული ახსნა

თქვენი კომპონენტებია `src/components/student2/index.jsx`, სტილია `cart.css`, საკუთარი Hook-ია `src/hooks/useLocalStorage.js`. ასევე უნდა ახსნათ საერთო Provider-ის კალათის მდგომარეობა და მოქმედებები. კოდის ეს ფაილები ინდივიდუალურ და სრულ ვერსიებში არ იცვლება.

## მონაცემთა ფორმატი და მდგომარეობები

კალათა შეიცავს `{ productId, quantity }` ჩანაწერებს. პროდუქტის სახელი/ფასი განმეორებით არ ინახება — ისინი `getProduct`-ით საერთო კატალოგიდან იკითხება. კალათის ერთი წყარო საშუალებას აძლევს სხვა სტუდენტების მოდულებსაც იმავე სიაში დაამატონ.

| მნიშვნელობა | დანიშნულება |
| --- | --- |
| `cart` | Provider-ის კალათა, საკუთარი Hook-ის შიდა useState-დან. |
| `coupon`, `setCoupon` | რეალურად გამოყენებული კუპონი, შენახვის Hook-დან. |
| `storageError` | კუპონის შენახვის შეცდომა. |
| `couponInput`, `setCouponInput` | ველში აკრეფილი კოდი, რომელსაც ჯერ შეიძლება კუპონი არ ჰქონდეს გამოყენებული. |
| `couponMessage`, `setCouponMessage` | წარმატების ან შეცდომის ტექსტი. |
| `couponError`, `setCouponError` | შეცდომის მდგომარეობა, მათ შორის aria-invalid-ისთვის. |
| `orderMessage`, `setOrderMessage` | სატესტო შეკვეთის დასრულების შეტყობინება. |

შეყვანილი კოდი და უკვე მოქმედი კუპონი სხვადასხვა მდგომარეობებია: ტექსტის აკრეფა ფასდაკლებას თავისთავად არ რთავს.

## Hook-ების ზუსტი გამოყენება

`useContext(StoreContext)` იღებს cart-ს, updateQuantity-ს, removeFromCart-ს, clearCart-ს და ვალუტაზე დამოკიდებულ formatPrice-ს.

`useLocalStorage('tech-store-coupon-v1', '', isCoupon)` კუპონს კითხულობს და ინახავს. იგივე Hook Provider-ში `tech-store-cart-v1` გასაღებით მართავს ნივთების სიას. მისი `useState` და `useEffect` ასრულებს დავალების კალათის მდგომარეობისა და შენახვის მოთხოვნას.

`useRef(null)` ქმნის `couponRef`-ს. `useEffect(..., [])` დამონტაჟებისას ცდილობს კუპონის ველზე ფოკუსს. ცარიელ კალათაში ფორმა არ რენდერდება და ref null რჩება; `?.` ამის გამო შეცდომას არ იწვევს. applyCoupon-ის შეცდომისას და removeCoupon-ის შემდეგაც გამოიყენება ფოკუსი.

`useMemo(() => calculateTotals(cart, coupon, products), [cart, coupon])` ხელახლა ითვლის თანხას, როცა კალათა ან კუპონი იცვლება. products ფაილის უცვლელი მონაცემია. ფასები ითვლება ლარში; ვალუტა მხოლოდ შედეგის ჩვენებას ცვლის.

`useCallback` გამოიყენება applyCoupon, checkout და removeCoupon ფუნქციებისთვის. მათი dependency array-ები იმ ცვლილებად მნიშვნელობებს შეიცავს, რომლებიც შესაბამის ფუნქციას სჭირდება.

## ყველა საკუთარი ფუნქცია

### `applyCoupon(event)`

`event.preventDefault()` აჩერებს გვერდის გადატვირთვას. `couponInput.trim()` შლის კიდეების გამოტოვებებს. თუ კოდი ზუსტად `სწავლა10` არ არის, ინახება error და ქართული შეტყობინება, ველი იღებს ფოკუსს და ფუნქცია სრულდება. უკვე მოქმედი სწორი კუპონი არასწორი ახალი ტექსტით ავტომატურად არ უქმდება. სწორი კოდი ინახება `setCoupon`-ით და ჩნდება 10%-ის წარმატების ტექსტი. დამოკიდებულებები: `[couponInput, setCoupon]`.

### `removeCoupon()`

ასუფთავებს მოქმედ კუპონს, ველის ტექსტსა და შეტყობინებას, თიშავს error-ს და აბრუნებს ფოკუსს. ამის შემდეგ useMemo ფასდაკლების გარეშე გადაანგარიშდება. დამოკიდებულება: `[setCoupon]`.

### `checkout()`

ცარიელი კალათისას არაფერს აკეთებს. სხვაგვარად ქმნის სატესტო შეკვეთის ტექსტს არსებული ჯამით, იძახებს `clearCart`-ს და ასუფთავებს კუპონს, შეყვანილ ტექსტსა და შეტყობინებას. გადახდის სერვისი არ გამოიძახება. დამოკიდებულებები: `[cart.length, totals.total, formatPrice, clearCart, setCoupon]`.

### `calculateTotals(items, coupon, products)`

`.reduce` ყველა ჩანაწერისთვის `.find`-ით პოულობს პროდუქტს და ჯამს ამატებს `product.price * item.quantity`-ს. დაკარგული პროდუქტი თანხაში 0-ს ამატებს. სწორი კუპონის შემთხვევაში `Math.round(subtotal * 10) / 100` იძლევა 10%-ს ორ ათწილადამდე; სხვა შემთხვევაში discount=0. total არის subtotal-discount, დამრგვალებული `Math.round(... * 100) / 100`-ით. ბრუნდება `{ subtotal, discount, total }`.

მაგალითი: ორი 149-ლარიანი ყურსასმენი იძლევა 298 ლარს; 10% არის 29.80 ლარი; გადასახდელი 268.20 ლარია.

## კომპონენტების სრული იერარქია

| კომპონენტი / callback | ფუნქცია |
| --- | --- |
| `CartModule()` | მართავს კუპონსა და სატესტო შეკვეთას და აჩვენებს კალათის UI-ს. |
| კუპონის `onChange` | ინახავს ველის ახალ ტექსტს `setCouponInput(event.target.value)`-ით. |
| `CartWrapper({ isEmpty, children })` | ცარიელობისას შეტყობინებას აჩვენებს; სხვაგვარად children-ს. |
| `CartList({ items, ... })` | `.map`-ით ქმნის CartItem-ებს და `getProduct`-ით აწვდის პროდუქტის სრულ მონაცემს. |
| `CartItem({ item, product, ... })` | აჩვენებს პროდუქტის სახელს, ფასს, რაოდენობას, მარაგს, ჯამსა და წაშლის ღილაკს. გამოყენებულია memo. |
| შემცირების callback | იძახებს `onQuantity(product.id, item.quantity - 1)`-ს. ერთეულისას ღილაკი disabled-ია. |
| გაზრდის callback | იძახებს `onQuantity(product.id, item.quantity + 1)`-ს. მარაგის მაქსიმუმზე ღილაკი disabled-ია. |
| წაშლის callback | იძახებს `onRemove(product.id)`-ს. |

შვილი CartItem მონაცემს პირდაპირ არ ცვლის. ფუნქციას მშობელს უბრუნებს არგუმენტებით; საბოლოო ცვლილება Provider-ში სრულდება. `CartWrapper`-ის `children` კომპოზიცია და `isEmpty` prop პირობით რენდერს ამტკიცებს. კუპონის შეცდომა, კუპონის გაუქმების ღილაკი და შეკვეთის შეტყობინება ასევე პირობითად ჩანს.

ყველა მონაცემიან კომპონენტს აქვს PropTypes: `items` არის `arrayOf(cartItemType)`, item/product — შესაბამისი shape, მოქმედებები — func, isEmpty — bool, children — node.

## შენი Custom Hook-ის მნიშვნელოვანი საზღვრები

`useLocalStorage`-ის სრული ნაბიჯები საერთო ნაწილშია განმარტებული. საწყისი validator იცავს წაკითხულ მონაცემს; შემდეგი მდგომარეობა კონტროლდება ჩვენი მოქმედებებით. Hook-ის შიგნით `setValue` საკუთარი ვალიდაციის wrapper არ არის. სხვა ადგილიდან მისთვის ნებისმიერი არასწორი value-ის მიწოდება ავტომატურად არ გასწორდება. ამ პროექტში Setter-ები მხოლოდ შეთანხმებული მონაცემებით იძახება.

## წარდგენის მაგალითი

დაამატე პროდუქტი სწრაფი არჩევიდან, გაზარდე რაოდენობა, სცადე არასწორი კუპონი, შემდეგ სწავლა10, გააუქმე კუპონი და გააფორმე სატესტო შეკვეთა. აჩვენე ახალი, ცარიელი კალათა და localStorage-ის ჩანაწერი. ტესტი ასევე ამოწმებს მარაგის ზედა ზღვარსა და წაშლას.


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

### `src/components/student2/index.jsx`

```jsx
// ავტორი: სტუდენტი 2 — კალათა; src/hooks/useLocalStorage.js ასევე ამ სტუდენტის ნაწილია.
import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StoreContext } from '../../context/StoreContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import { products, getProduct } from '../../utils/products';
import { calculateTotals } from '../../utils/cart';
import { isCoupon } from '../../utils/storage';
import { cartItemType, productType } from '../../utils/propTypes';
import Panel from '../shared/Panel';
import './cart.css';

export const moduleInfo = { order: 2, title: 'კალათა', student: 'სტუდენტი 2' };

export default function CartModule() {
  const { cart, updateQuantity, removeFromCart, clearCart, formatPrice } = useContext(StoreContext);
  const [coupon, setCoupon, storageError] = useLocalStorage('tech-store-coupon-v1', '', isCoupon);
  const [couponInput, setCouponInput] = useState(coupon);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const couponRef = useRef(null);
  const totals = useMemo(() => calculateTotals(cart, coupon, products), [cart, coupon]);

  useEffect(() => {
    couponRef.current?.focus();
  }, []);

  const applyCoupon = useCallback((event) => {
    event.preventDefault();
    const value = couponInput.trim();
    if (value !== 'სწავლა10') {
      setCouponError(true);
      setCouponMessage('კუპონი არასწორია. გამოიყენე სწავლა10.');
      couponRef.current?.focus();
      return;
    }
    setCoupon(value);
    setCouponError(false);
    setCouponMessage('კუპონი გამოყენებულია: ფასდაკლება 10%.');
  }, [couponInput, setCoupon]);

  const checkout = useCallback(() => {
    if (!cart.length) return;
    setOrderMessage(`სატესტო შეკვეთა გაფორმდა. ჯამი: ${formatPrice(totals.total)}. თანხა არ ჩამოჭრილა.`);
    clearCart();
    setCoupon('');
    setCouponInput('');
    setCouponMessage('');
  }, [cart.length, totals.total, formatPrice, clearCart, setCoupon]);

  const removeCoupon = useCallback(() => {
    setCoupon(''); setCouponInput(''); setCouponMessage(''); setCouponError(false);
    couponRef.current?.focus();
  }, [setCoupon]);

  return <Panel title="საყიდლების კალათა" description="შეცვალე რაოდენობა, გამოიყენე კუპონი და ნახე შეკვეთის ჯამი.">
    {storageError && <p role="alert" className="error-text">{storageError}</p>}
    {orderMessage && <p role="status" className="success-text">{orderMessage}</p>}
    <CartWrapper isEmpty={!cart.length}>
      <div className="cart-layout">
        <CartList items={cart} onQuantity={updateQuantity} onRemove={removeFromCart} formatPrice={formatPrice} />
        <aside className="cart-summary" aria-label="შეკვეთის შეჯამება">
          <h3>შეკვეთის შეჯამება</h3>
          <p><span>პროდუქტების ჯამი</span><strong>{formatPrice(totals.subtotal)}</strong></p>
          <p><span>ფასდაკლება</span><strong>{formatPrice(totals.discount)}</strong></p>
          <p className="cart-total"><span>გადასახდელი</span><strong>{formatPrice(totals.total)}</strong></p>
          <form onSubmit={applyCoupon} noValidate>
            <label>კუპონის კოდი<input ref={couponRef} value={couponInput}
              aria-invalid={couponError} aria-describedby={couponMessage ? 'coupon-message' : 'coupon-help'}
              onChange={(event) => setCouponInput(event.target.value)} placeholder="სწავლა10" /></label>
            <p id="coupon-help" className="muted">კუპონი სწავლა10 გაძლევს 10% ფასდაკლებას.</p>
            <button type="submit" className="secondary">კუპონის გამოყენება</button>
          </form>
          {couponMessage && <p id="coupon-message" role={couponError ? 'alert' : 'status'}
            className={couponError ? 'error-text' : 'success-text'}>{couponMessage}</p>}
          {coupon && <button type="button" className="text-button" onClick={removeCoupon}>კუპონის გაუქმება</button>}
          <button type="button" className="cart-checkout" onClick={checkout}>სატესტო შეკვეთის გაფორმება</button>
          <p className="muted">რეალური გადახდა არ სრულდება.</p>
        </aside>
      </div>
    </CartWrapper>
  </Panel>;
}

CartModule.propTypes = {};

export function CartWrapper({ isEmpty, children }) {
  return isEmpty ? <p className="empty-state">კალათა ცარიელია. დაამატე პროდუქტი კატალოგიდან ან სწრაფი არჩევიდან.</p>
    : <div className="cart-wrapper">{children}</div>;
}

CartWrapper.propTypes = { isEmpty: PropTypes.bool.isRequired, children: PropTypes.node.isRequired };

export function CartList({ items, onQuantity, onRemove, formatPrice }) {
  return <div className="cart-list">{items.map((item) => <CartItem key={item.productId}
    item={item} product={getProduct(item.productId)} onQuantity={onQuantity}
    onRemove={onRemove} formatPrice={formatPrice} />)}</div>;
}

CartList.propTypes = {
  items: PropTypes.arrayOf(cartItemType).isRequired, onQuantity: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired, formatPrice: PropTypes.func.isRequired,
};

export const CartItem = memo(function CartItem({ item, product, onQuantity, onRemove, formatPrice }) {
  return <article className="cart-item">
    <span className="cart-icon" aria-hidden="true">{product.icon}</span>
    <div className="grow"><h3>{product.name}</h3><p className="muted">ერთეულის ფასი: {formatPrice(product.price)}</p>
      <div className="cart-quantity" role="group" aria-label={`${product.name}: რაოდენობა`}>
        <button type="button" className="secondary" disabled={item.quantity === 1}
          aria-label={`${product.name}: რაოდენობის შემცირება`} onClick={() => onQuantity(product.id, item.quantity - 1)}>−</button>
        <span aria-live="polite">{item.quantity}</span>
        <button type="button" className="secondary" disabled={item.quantity >= product.stock}
          aria-label={`${product.name}: რაოდენობის გაზრდა`} onClick={() => onQuantity(product.id, item.quantity + 1)}>+</button>
      </div><p className="muted">მარაგში: {product.stock}</p>
    </div>
    <div className="cart-item-end"><strong>{formatPrice(product.price * item.quantity)}</strong>
      <button type="button" className="text-button danger" aria-label={`${product.name}: კალათიდან წაშლა`}
        onClick={() => onRemove(product.id)}>წაშლა</button></div>
  </article>;
});

CartItem.propTypes = {
  item: cartItemType.isRequired, product: productType.isRequired,
  onQuantity: PropTypes.func.isRequired, onRemove: PropTypes.func.isRequired, formatPrice: PropTypes.func.isRequired,
};
```

### `src/hooks/useLocalStorage.js`

```javascript
// სტუდენტი 2: საერთო შენახვის Hook; გამოიყენება საერთო კონტექსტშიც.
import { useEffect, useState } from 'react';
import { readStoredValue } from '../utils/storage';

export default function useLocalStorage(key, initialValue, validate) {
  const [value, setValue] = useState(() => readStoredValue(key, initialValue, validate));
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setStorageError('');
    } catch {
      setStorageError('ბრაუზერში შენახვა მიუწვდომელია. მონაცემები იმუშავებს გვერდის განახლებამდე.');
    }
  }, [key, value]);

  return [value, setValue, storageError];
}
```

### `src/utils/cart.js`

```javascript
export function calculateTotals(items, coupon, products) {
  const subtotal = items.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  const discount = coupon === 'სწავლა10' ? Math.round(subtotal * 10) / 100 : 0;
  return { subtotal, discount, total: Math.round((subtotal - discount) * 100) / 100 };
}
```

### `src/components/student2/cart.css`

```css
.cart-layout { display: grid; grid-template-columns: minmax(0, 1fr) 310px; gap: 22px; align-items: start; }
.cart-item { display: flex; gap: 16px; align-items: center; padding: 18px 0; border-bottom: 1px solid #dce2ea; }
.cart-item h3 { margin: 0; }
.cart-icon { font-size: 34px; background: #edf2f9; padding: 10px; border-radius: 8px; }
.cart-quantity { display: flex; align-items: center; gap: 14px; }
.cart-quantity button { padding: 5px 12px; }
.cart-item-end { display: grid; gap: 10px; text-align: right; }
.cart-summary { background: #f4f6fa; padding: 18px; border-radius: 10px; border: 1px solid #dce2ea; }
.cart-summary > p:not(.muted):not(.error-text):not(.success-text) { display: flex; gap: 12px; justify-content: space-between; }
.cart-summary form { display: grid; gap: 10px; }
.cart-total { padding-top: 14px; border-top: 1px solid #dce2ea; }
.cart-checkout { width: 100%; margin-top: 18px; }
@media (max-width: 800px) { .cart-layout { grid-template-columns: 1fr; } }
@media (max-width: 500px) { .cart-item { flex-wrap: wrap; } .cart-icon { display: none; } }
```

## შეფასების მოთხოვნებთან კავშირი

შედეგი 1: პირადად აჩვენე Node/npm, Vite-ის შექმნა, საქაღალდეები და JSX. შედეგი 2: ზემოთ აღწერილი ექვსივე React Hook და შენი Custom Hook. შედეგი 3: კომპონენტების იერარქია, მონაცემებისა და callback props-ის გადაცემა, children, PropTypes და პირობითი რენდერი. პროექტის მზადყოფნა პირადი წარდგენისა და რეალური Commit History-ის საჭიროებას არ აუქმებს.
