const Database = require('../db/config')

module.exports = {
  async create(req, res) {
    const db = await Database()
    const pass = req.body.password
    let roomId
    let isRoom = true
    while (isRoom) {
      /* Gera o numero da sala */
      for (var i = 0; i < 6; i++) {
        i == 0
          ? (roomId = Math.floor(Math.random() * 10).toString())
          : (roomId += Math.floor(Math.random() * 10).toString())
      }

      /* Verificar se esse numero ja existe */
      const roomsExistIds = await db.all(`SELECT id FROM room`)

      isRoom = roomsExistIds.some(roomsExistId => roomsExistId === roomId)

      if (!isRoom) {
        /* Inseri a sala no banco */
        await db.run(`INSERT INTO room (
          id,
          pass
        ) VALUES (
          ${parseInt(roomId)}, 
          ${pass}
      )`)
      }
    }

    await db.close()

    res.redirect(`/room/${roomId}`)
  },

  async open(req, res) {
    const db = await Database()
    const roomId = req.params.room
    const questions = await db.all(
      `SELECT * FROM questions WHERE room = ${roomId} and read = 0`
    )
    const questionsRead = await db.all(
      `SELECT * FROM questions WHERE room = ${roomId} and read = 1`
    )

    res.render('room', {
      roomId: roomId,
      questions: questions,
      questions,
      questionsRead: questionsRead
    })
  },

  enter(req, res) {
    const roomId = req.body.roomId

    res.redirect(`/room/${roomId}`)
  }
}
