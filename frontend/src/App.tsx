import { useCookies } from "react-cookie"

export default function App() {

  const [cookies, setCookies] = useCookies(["email"]);
  console.log("cookies", cookies.email);

  return <div>
    <div>{cookies.email}</div>

  </div>
}

