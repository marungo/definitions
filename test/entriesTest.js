/* eslint-env mocha */

require('mocha')
const { expect } = require('chai')
const { post } = require('./requestHelper.js')
const db = require('../server/db')

const entriesTest = () => {
  describe('Entry route', () => {
    describe('POST /setstatus', () => {
      describe('accepting a definition', () => {
        beforeEach(async () => {
          const { statusCode } = await post('/requested/test124')
          expect(statusCode).to.equal(200)

          const updatingRequestedResult = await post('/requested/test124?action=accepted', { json: true })
          expect(updatingRequestedResult.statusCode).to.equal(200)

          const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
          const payload = {
            term: 'test124',
            definition: '1st definition',
            action: 2
          }

          const entryResult = await post('/entries', { json: false }, { headers: headers, body: JSON.stringify(payload) })
          expect(entryResult.statusCode).to.equal(200)
        })

        it('sets a request for that term to fulfilled if this is the 2nd accepted definition', async () => {
          const { statusCode, body } = await post('/entries/setstatus/2/id/2/term/test124')

          expect(statusCode).to.equal(200)
          expect(body).to.equal('Set status to 2 for entry with id: 2')

          const { rows } = await db.query('SELECT * FROM requested')

          expect(rows.length).to.equal(1)
          expect(rows[0]).to.eql({
            term: 'test124',
            action: 2,
            fulfilled: 1
          })
        })
      })
    })
  })
}

module.exports = entriesTest
