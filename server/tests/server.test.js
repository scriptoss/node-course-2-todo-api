const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
},{
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

beforeEach((done) => {
  Todo.remove({}).then(() =>{
    Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err,res) => {
      if(err){
        return done(err);
      }

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    });
  });

  it('Should not create todo with invalid body data', (done) => {
    var text = '';

    request(app)
    .post('/todos')
    .send({text})
    .expect(400)
    .end((err,res) => {
      if(err){
        return done(err);
      }

      Todo.find().then((todos) =>{
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    });
  });
});


describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2)
    })
    .end(done)
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('Should a 404 if todo not found', (done) => {
    var id = new ObjectID();
    request(app)
    .get(`/todos/${id.toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('Should a 404 for non-object ids', (done) => {
    var id = '123'
    request(app)
    .get(`/todos/${id}`)
    .expect(404)
    .end(done);
  })
});

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId);
    })
    .end((err, res) => {
      if (err){
        return done(err);
      }

      Todo.findById(todos[1]._id).then((todo) => {
        expect(todo).toNotExist();
        done();
      }, (e) => done(e));
    });
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(404)
    .end(done)
  });

  it('should return 404 if object id is invalid', (done) => {
    var hexId = 'abc123'
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(404)
    .end(done)
  });
});

describe('PATCH /todos/:id', () => {
  it('Should update the todo', (done) =>{
    var hexId = todos[0]._id.toHexString();
    var newText = "updated text"
    request(app)
    .patch(`/todos/${hexId}`)
    .send({text: newText, completed:true})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(newText);
    })
    .end((err,res) => {
      if(err) {
        return done(err);
      }
      Todo.findById(todos[0]._id).then((todo) => {
        expect(todo.text).toBe(newText);
        expect(todo.completed).toBe(true);
        expect(todo.completedAt).toBeA('number');
        done();
      }, (e) => done(e));
    });
  });
  it('Should clear completedAt when the todo is not completed', (done) =>{
      var hexId = todos[1]._id.toHexString();
      var newText = "something different"
      request(app)
      .patch(`/todos/${hexId}`)
      .send({text: newText, completed:false})
      .expect(200)
      .expect((res) =>{
        expect(res.body.todo.text).toBe(newText);
      })
      .end((err,res) => {
        if(err) {
          return done(err);
        }

        Todo.findById(todos[1]._id).then((todo) => {
          expect(todo.text).toBe(newText);
          expect(todo.completed).toBe(false);
          expect(todo.completedAt).toNotExist();
          done();
        }, (e) => done(e));
      });
    });
});
