import { TextField } from '@mui/material'
import { setSearch } from "../../redux/slices/Search/search";
import { useDispatch, useSelector } from "react-redux";

export const Search = () => {
  const dispatch = useDispatch();
  const { text } = useSelector((state) => state.search);


  return (
    <div className="search">
      <TextField
        value={text}
        onChange={e => dispatch(setSearch(e.target.value))}
        label="Поиск"
        variant="outlined"
      />
    </div>
  )
}
