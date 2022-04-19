Cypress._.times(5, function () {
    it('test the privacy policy page independently', function() {
        cy.visit('./src/privacy.html')

        cy.contains('Talking About Testing').should('be.visible')
    })
})