import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { decrement, incremenetByAmount, increment } from "../../store/reducers/counter/counter"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const Counter = () => {
  const [value, setValue] = useState(0)
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()
  const navigate = useNavigate();
  return (
    <div>
      <div>{ count }</div>
      <div>
        <button onClick={() => dispatch(increment())}>
          Incrementar +
        </button>
      </div>
      <div>
        <button onClick={() => dispatch(decrement())}>
          Decrementar -
        </button>
      </div>
      <div>
        <input type="number" onChange={e => setValue(Number(e.target.value))} value={value} />
        <button onClick={() => dispatch(incremenetByAmount(value))}>
          Incrementar por valor +
        </button>
      </div>
      <button onClick={() => navigate('/login')}>
          Ir para Login
        </button>
    </div>
  )
}