Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(name, surname, email, phone) {
    cy.get('#firstName').type(name)
    cy.get('#lastName').type(surname)
    cy.get('#email').type(email)
    cy.get('#open-text-area').type(phone)
    cy.contains('button', 'Enviar').click()
})