import SearchLocation from "./SearchLocation";

function App() {

  return (

    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl"> Weather in Your Location! </h1>
      <SearchLocation />
    </div>



  );
}

export default App;
