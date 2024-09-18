import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AiFillEdit } from 'react-icons/ai'
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im'
import { Link } from 'react-router-dom'

import styled from 'styled-components'

const SearchAndButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const SearchForm = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  margin: 10px 0;
  padding: 10px;
`

const RemoveAllButton = styled.button`
  width: 16%;
  height: 40px;
  background: #f54242;
  border: none;
  font-weight: 500;
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
`

const TodoName = styled.span`
  font-size: 27px;
  ${({ $is_completed }) => $is_completed && `
    opacity: 0.4;
  `}
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 7px auto;
  padding: 10px;
  font-size 25px;
`

const CheckedBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  color: green;
  cursor: pointer;
`

const UncheckBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
  cursor: pointer;
`

const EditButton = styled.span`
  display: flex;
  align-items: center;
  margin: 0 7px;
`

export const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    axios.get('/api/v1/todos.json')
      .then(res => {
        console.log(res.data);
        setTodos(res.data);
      })
      .catch(e => {
        console.log(e);
      })
  }, []);

  const removeAllTodos = () => {
    const sure = window.confirm('Are you sure?');
    if (sure) {
      axios.delete('/api/v1/todos/destroy_all')
        .then(res => {
          setTodos([]);
        }).catch(e => console.log(e));
    }
  }

  const updateIsCompleted = (index, value) => {
    const data = {
      id: value.id,
      name: value.name,
      is_completed: !value.is_completed
    }
    axios.patch(`/api/v1/todos/${value.id}`, data)
      .then(res => {
        const newTodos = [...todos];
        newTodos[index].is_completed = res.data.is_completed
        setTodos(newTodos);
      })
  }

  return (
    <>
      <h1>Todo List</h1>
      <SearchAndButton>
        <SearchForm type='text' placeholder='search todo' onChange={e => setSearchName(e.target.value)} value={searchName} />
        <RemoveAllButton onClick={removeAllTodos}>Remove all</RemoveAllButton>
      </SearchAndButton>
      {todos.filter(val => searchName === "" || val.name.toLowerCase().includes(searchName.toLowerCase()))
        .map((val, key) => (
          <Row key={key}>
            {val.is_completed ? (
              <CheckedBox>
                <ImCheckboxChecked onClick={() => updateIsCompleted(key, val)} />
              </CheckedBox>
            ) : (
                <UncheckBox>
                  <ImCheckboxUnchecked onClick={() => updateIsCompleted(key, val)} />
              </UncheckBox>
            )}
            <TodoName $is_completed={val.is_completed}>
              {val.name}
            </TodoName>
            <Link to={`/todos/${val.id}/edit`}>
              <EditButton>
                <AiFillEdit />
              </EditButton>
            </Link>
          </Row>
        ))}
    </>
  )
}
