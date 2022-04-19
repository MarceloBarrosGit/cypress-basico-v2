/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    const THREE_SECONDS_IN_MS = 3000

    this.beforeEach(function() {
        cy.visit('./src/index.html')
    })

    it('verify aplication title', function() {

        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('fill mandatory fields and send the form', function() {
        const longText = 'Try type a longtext in the text area, to verify the time spent in the test'
        cy.clock()

        cy.get('#firstName').type('Marcelo')
        cy.get('#lastName').type('Barros')
        cy.get('#email').type('marcelo.barros@teste.com')
        cy.get('#open-text-area').type(longText, {delay: 0})
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')

    })

    it('display error message when submit form with a invalid format email', function() {
        cy.clock()

        cy.get('#firstName').type('Marcelo')
        cy.get('#lastName').type('Barros')
        cy.get('#email').type('marcelo.barros£teste.com')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    Cypress._.times(2, function () {
        it('validate that only numbers can be typed at phone field', function() {
            cy.get('#firstName').type('Marcelo')
            cy.get('#lastName').type('Barros')
            cy.get('#email').type('marcelo.barros@teste.com')
            cy.get('#phone')
                .type('abcdefgh')
                .should('have.value', '')
        })
    })

        it('display error message when the phone becomes mandatory, but is not filled before form will be sent', function () {
            cy.clock()
            cy.get('#firstName')
                .type('Marcelo')
            cy.get('#lastName')
                .type('Barros')
            cy.get('#email')
                .type('marcelo.barros@teste.com')
            cy.get('#phone-checkbox')
                .check()
            cy.get('#open-text-area')
                .type('teste')
            cy.contains('button', 'Enviar').click()
                .click()

            cy.get('.error').should('be.visible')

            cy.tick(THREE_SECONDS_IN_MS)

            cy.get('.error').should('not.be.visible')

        })

    it('fill and clean name, surname, email and phone fields', function() {
        const name = 'Marcelo', surname = 'Barros', email = 'marcelo.barros@teste.com', phone = '987654321'
        cy.get('#firstName')
            .type(name)
            .should('have.value', name)
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type(surname)
            .should('have.value', surname)
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type(email)
            .should('have.value', email)
            .clear()
            .should('have.value', '')
        cy.get('#phone')
            .type(phone)
            .should('have.value', phone)
            .clear()
            .should('have.value', '')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('display error message when submit form without fill mandatory fields', function() {
        cy.clock()
        cy.contains('button', 'Enviar').click()
            .click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('send the form properly using custom command', function() {
        cy.clock()

        cy.fillMandatoryFieldsAndSubmit('Marcelo', 'Barros', 'marcelo.barros@teste.com', '987654321')

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('select a product (YouTube) by text', function() {
        cy.get('#product')
            .select('YouTube')
            .should('have.value', 'youtube')
    })

    it('select a product (Mentoria) by value', function() {
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('select a product (Blog) by index', function() {
        cy.get('#product')
            .select(1)
            .should('have.value', 'blog')
    })

    it('select service type "Feedback"', function() {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    })

    it('select each service type', function() {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })

    it('select both checkboxs, then deselect the last one', function() {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    it('select a file from fixtures folder', function() {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json')
            .should(function($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('select a file simulating drag-and-drop', function() {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json', {action: ('drag-drop')})
            .should(function($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('select a file using a fixture which was given a alias', function() {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
            .selectFile('@sampleFile')
            .should(function($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('verify that privacy policy is opened in another tab without any click is needed', function() {
        cy.get('#privacy a')
            .should('have.attr', 'target', '_blank')
    })

    it('access privacy policy page by removing the target and then click link', function() {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()

        cy.contains('Talking About Testing').should('be.visible')
    })

    it('show and hide success and error messages using .invoke', function() {
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide')
            .should('not.be.visible')
        cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios!')
            .invoke('hide')
            .should('not.be.visible')
    })

    it('fill text area using invoke command', function () {
        const longText = Cypress._.repeat('0123456789', 20)

        cy.get('#open-text-area')
            .invoke('val', longText)
            .should('have.value', longText)
    })

    it('make a HTTP request', function() {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should(function(response) {
                const {status, statusText, body} = response
                expect(status).to.equal(200)
                expect(statusText).to.equal('OK')
                expect(body).to.include('CAC TAT')
            })
    })

    it('find hidden cat', function () {
        cy.get('#cat')
            .invoke('show')
            .should('be.visible')
        cy.get('#title')
            .invoke('text', 'CAT TAT')
        cy.get('#subtitle')
            .invoke('text', 'I 💛 cats!')
    })
})