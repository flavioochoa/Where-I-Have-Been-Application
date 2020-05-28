import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Place } from '../types/Place'
import HeaderSubHeader from 'semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  places: Place[]
  newTodoName: string
  loadingTodos: boolean
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    places: [],
    newTodoName: '',
    loadingTodos: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onPlaceCreate = () => {
    this.props.history.push('/places/new')
  }

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        places: this.state.places.filter(todo => todo.placeId != todoId)
      })
      alert("deleted!");
    } catch {
      alert('Todo deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const places = await getTodos(this.props.auth.getIdToken())
      this.setState({
        places,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Where i have been?</Header>
        <HeaderSubHeader as="h3">Places I really liked</HeaderSubHeader>
        {this.renderCreateTodoInput()}

        {this.renderTodos()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Button secondary
            onClick={() => this.onPlaceCreate()}
          >New Place</Button>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading places
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.places.map((todo, pos) => {
          return (
            <Grid.Row key={todo.placeId}>
              <Grid.Column width={7} verticalAlign="middle">
                {todo.markerName}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {todo.markerText}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {todo.lat} - {todo.lng}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.placeId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.placeId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.props.history.push("/location",{data:todo})}
                >
                  <Icon name="map" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
