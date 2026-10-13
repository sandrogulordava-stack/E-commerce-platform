# შეფასების კრიტერიუმები — ოთხივე სტუდენტისთვის

ეს ცხრილები ეფუძნება მომხმარებლის მიერ მოწოდებულ შეფასების ინსტრუმენტს №1, სწავლის შედეგებს 1, 2 და 3. კონკრეტული ქულები და დამატებითი ოფიციალური კრიტერიუმები მოწოდებული არ ყოფილა. მოგვიანებით მოწოდებული LMS-ის სქემა აღწერილია GIT-LMS.md-ში.

## სწავლის შედეგი 1 — თითოეულმა სტუდენტმა პირადად უნდა აჩვენოს

| მოთხოვნა | მტკიცებულება / მოქმედება |
| --- | --- |
| Node.js/npm და VS Code | პირადად აჩვენოს `node -v`, `npm -v` და საკუთარი სამუშაო გარემო |
| Vite-ის საშუალებით React პროექტის შექმნა | საკუთარი პროექტი შექმნას `npm create vite@latest student-N -- --template react` ბრძანებით; პროცესი აღწერილია `STUDENT-N.md`-ში |
| სამუშაო გარემო და სტრუქტურა | ყველა პაკეტშია `src/components`, `src/hooks`, `src/utils`, `vite.config.js`, `package.json`, lock ფაილი |
| JSX და HTML ელემენტების ეკვივალენტები | თითოეულის `index.jsx` შეიცავს ფორმებს, `label`, `button`, `input`, `select`, სიებს, `className` და `onChange`/`onClick` |

მზა ფაილის ჩამოტვირთვა სტუდენტის მიერ ინსტალაციისა და გარემოს მომზადების ფაქტს თავისთავად ვერ ადასტურებს. ინდივიდუალური პრაქტიკული დემონსტრაცია და რეალური GitHub ისტორია მაინც საჭიროა.

## სწავლის შედეგი 2 — სტუდენტი 1

ძირითადი ფაილი: `src/components/student1/index.jsx`.

| კრიტერიუმი | რეალიზაცია |
| --- | --- |
| `useState` | `search`, `category`, `products`, `loading`, `error`, განმეორებითი ჩატვირთვა |
| `useEffect` | მონაცემების სიმულაციური ჩატვირთვა და ფოკუსი; cleanup შეწყვეტს ჩატვირთვას |
| `useContext` | ვალუტა/ფასის ფორმატირება, კალათისა და რჩეულების გლობალური მოქმედებები |
| `useRef` | საძიებო ველის ავტომატური ფოკუსი და გასუფთავების შემდეგ ფოკუსის დაბრუნება |
| `useMemo` | ძებნითა და კატეგორიით გაფილტრული პროდუქტები |
| `useCallback` | `clearFilters` |
| საკუთარი Hook | `src/hooks/student1/useDebounce.js`; ძებნის 300 მილიწამიანი დაყოვნება და cleanup |

## სწავლის შედეგი 2 — სტუდენტი 2

ძირითადი ფაილები: `src/components/student2/index.jsx`, `src/hooks/useLocalStorage.js` და საერთო `StoreContext.jsx`-ში კალათის მოქმედებები.

| კრიტერიუმი | რეალიზაცია |
| --- | --- |
| `useState` | კალათის ნივთები `useLocalStorage`-ის `useState`-ში; კომპონენტში კუპონის ველი, შეტყობინება და შეკვეთის მდგომარეობა |
| `useEffect` | კალათისა და კუპონის შენახვა საკუთარი `useLocalStorage` Hook-ით; კუპონის ფოკუსი მოდულში |
| `useContext` | გლობალური კალათა, რაოდენობის ცვლილება, წაშლა და ვალუტაზე დამოკიდებული ფასი |
| `useRef` | კუპონის ველის ფოკუსი, მათ შორის არასწორი კოდისას |
| `useMemo` | ჯამი, ფასდაკლება და გადასახდელი თანხა |
| `useCallback` | `applyCoupon`, `removeCoupon`, `checkout`; საერთო კონტექსტში კალათის მოქმედებები |
| საკუთარი Hook | `src/hooks/useLocalStorage.js`; კითხვა, `useState`, `useEffect` შენახვა და შეცდომის დამუშავება |

კალათის ნივთების მდგომარეობა განზრახ მოთავსებულია ამ Hook-ში და გლობალურ Provider-ს მიეწოდება: კატალოგსა და რჩეულებს იგივე კალათის შეცვლა სჭირდება. ეს ერთი საერთო მდგომარეობაა; ცალკე, ერთმანეთთან შეუსაბამო კალათები არ არსებობს.

## სწავლის შედეგი 2 — სტუდენტი 3

ძირითადი ფაილი: `src/components/student3/index.jsx`.

| კრიტერიუმი | რეალიზაცია |
| --- | --- |
| `useState` | ფორმის ველები, შეფასებების სია, პროდუქტი, საშუალო ქულა და ახალი კომენტარის იდენტიფიკატორი |
| `useEffect` | საშუალო რეიტინგის განახლება, შენახვა და ახალ კომენტარზე გადახვევა |
| `useContext` | საერთო პროდუქტები და წარმატების შეტყობინება |
| `useRef` | `latestReviewRef` — ახალი კომენტარი; `nameRef` — ვალიდაციის შემდეგ ფოკუსი |
| `useMemo` | არჩეული პროდუქტის შეფასებების გაფილტვრა და თარიღით დალაგება |
| `useCallback` | `handleSubmit`, `handleChange`, `handleProductChange` |
| საკუთარი Hook | `src/hooks/student3/useFormValidation.js`; შეცდომების მდგომარეობა, ვალიდაცია და გასუფთავება |

## სწავლის შედეგი 2 — სტუდენტი 4

ძირითადი ფაილი: `src/components/student4/index.jsx`.

| კრიტერიუმი | რეალიზაცია |
| --- | --- |
| `useState` | ძებნის ტექსტი და დალაგების რეჟიმი |
| `useEffect` | საძიებო ველის ფოკუსი; საკუთარ Hook-ში დაყოვნება და cleanup |
| `useContext` | საერთო რჩეულები, კალათა, ვალუტა და მოქმედებები |
| `useRef` | საძიებო ველის ფოკუსი და გასუფთავების შემდეგ დაბრუნება |
| `useMemo` | რჩეული პროდუქტები და სიის საერთო ღირებულება; Hook-ში გაფილტვრა და დალაგება |
| `useCallback` | `moveToCart`, `clearFilters` |
| საკუთარი Hook | `src/hooks/student4/useFavoriteSearch.js`; 250 მილიწამიანი დაყოვნებული ძებნა და სიის დალაგება |

რჩეულები ინახება საერთო Provider-ში იმავე `useLocalStorage` ინფრასტრუქტურით. სტუდენტი 4-ის საკუთარ Hook-ად ითვლება `useFavoriteSearch`, და არა სტუდენტი 2-ის შენახვის Hook.

## სწავლის შედეგი 3 — ოთხივე სტუდენტი

| სტუდენტი | იერარქია | მონაცემები და callback props | `children` | PropTypes და პირობითი რენდერი |
| --- | --- | --- | --- | --- |
| 1 | `CatalogModule → ProductGrid → ProductCard` | პროდუქტი, რჩეულის მდგომარეობა, `onAdd`, `onFavorite`, `formatPrice` | `Panel`-ში მოდულის შიგთავსი | ყველა props; ჩატვირთვა, შეცდომა, ცარიელი ძებნა, ფასდაკლება |
| 2 | `CartModule → CartWrapper → CartList → CartItem` | ნივთი, პროდუქტი, `onQuantity`, `onRemove`, `formatPrice` | `CartWrapper` და `Panel` | ყველა props; ცარიელი კალათა, კუპონის შეცდომა, შეკვეთა, მარაგის ღილაკები |
| 3 | `ReviewSection → ReviewForm → StarRating`; `ReviewList → ReviewCard` | ველები, შეცდომები, რეიტინგი, `onChange`, `onSubmit`, მიმოხილვა | `Panel` | ყველა props; ფორმის შეცდომები, ცარიელი სია, ახალი მიმოხილვა |
| 4 | `FavoritesModule → FavoritesWrapper → FavoriteList → FavoriteCard` | პროდუქტი, `onRemove`, `onMove`, `formatPrice` | `FavoritesWrapper` და `Panel` | ყველა props; ცარიელი სია და უშედეგო ძებნა |

Props-ის გარეშე კომპონენტებს აქვთ ცარიელი `.propTypes = {}`. მონაცემიანი კომპონენტები იყენებს `isRequired`, `shape`, `arrayOf`, `func`, `bool`, `string`, `number`, `node` ვალიდატორებს. საერთო ტიპებია `src/utils/propTypes.js`-ში.

React-იდან იმპორტირებული ერთადერთი Hook-ებია: `useState`, `useEffect`, `useContext`, `useRef`, `useMemo`, `useCallback`. გამოყენებული `memo`, `createContext` და `StrictMode` Hook-ები არ არის. დამატებით არის მხოლოდ დავალებით დაშვებული საკუთარი Custom Hook-ები.
