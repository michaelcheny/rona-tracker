import React, { useState } from "react";

const Search = () => {
  const [input, setInput] = useState("");

  return (
    <div>
      <form>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      </form>
    </div>
  );
};

export default Search;
