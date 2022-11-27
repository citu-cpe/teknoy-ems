describe('announcement.spec.ts - Announcement Page', () => {
  beforeEach(() => {
    cy.resetTestDataAndLoginAsAdmin();

    cy.visit('/announcements');

    cy.intercept('GET', '/api/v1/announcement').as('getAllAnnouncement');
    cy.intercept('POST', '/api/v1/announcement').as('createAnnouncement');
    cy.intercept('PUT', '/api/v1/announcement/*').as('editAnnouncement');
    cy.intercept('DELETE', '/api/v1/announcement/*').as('deleteAnnouncement');

    cy.wait('@getAllAnnouncement');
  });

  const announcementTitle = 'NEW ANNOUNCEMENT';
  const announcementSubtitle = 'SUBTITLE';
  const announcementContent = 'this is a content';
  const announcementTags = 'tag1';
  const announcementViewAccess = 'PRIVATE';

  const announcementAddTitle = 'No Classes';
  const announcementAddSubtitle = 'Collge Level';
  const announcementAddContent =
    'there will be no classes for college level on monday';
  const announcementAddTags = 'Memo';
  const announcementAddViewAccess = 'PUBLIC';

  it('should get all announcement', () => {
    cy.getBySel('announcement-row').should('have.length', 1);

    cy.getBySel('announcement-title')
      .contains(announcementTitle)
      .should('exist');
    cy.getBySel('announcement-subtitle')
      .contains(announcementSubtitle)
      .should('exist');
    cy.getBySel('announcement-content')
      .contains(announcementContent)
      .should('exist');
    cy.getBySel('announcement-tags').contains(announcementTags).should('exist');
    cy.getBySel('announcement-view-access')
      .contains(announcementViewAccess)
      .should('exist');

    //should show venue view
    cy.getBySel('announcement-row').first().click();
    cy.getBySel('announcement-view-title')
      .contains(announcementTitle)
      .should('exist');
    cy.getBySel('announcement-view-subtitle')
      .contains(announcementSubtitle)
      .should('exist');
    cy.getBySel('announcement-view-content')
      .contains(announcementContent)
      .should('exist');
    cy.getBySel('announcement-view-tags')
      .contains(announcementTags)
      .should('exist');
    cy.getBySel('announcement-view-view-access')
      .contains(announcementViewAccess)
      .should('exist');
  });

  it('should add an announcement', () => {
    cy.getBySel('add-announcement-btn').click();

    cy.getBySel('title-input').type(announcementAddTitle);
    cy.getBySel('subtitle-input').type(announcementAddSubtitle);
    cy.getBySel('content-input').type(announcementAddContent);
    cy.getBySel('memo-checkbox').click();
    cy.getBySel('viewAccess-select').select(announcementAddViewAccess);

    cy.getBySel('add-submit-btn').click();

    cy.wait('@createAnnouncement');

    cy.getBySel('close-btn').click();

    cy.wait('@getAllAnnouncement');
    cy.getBySel('announcement-row').should('have.length', 2);
    cy.getBySel('announcement-title')
      .contains(announcementAddTitle)
      .should('exist');
    cy.getBySel('announcement-subtitle')
      .contains(announcementAddSubtitle)
      .should('exist');
    cy.getBySel('announcement-content')
      .contains(announcementAddContent)
      .should('exist');
    cy.getBySel('announcement-tags')
      .contains(announcementAddTags)
      .should('exist');
    cy.getBySel('announcement-view-access')
      .contains(announcementAddViewAccess)
      .should('exist');
  });

  it('should add an announcement even if subtitle field is not populated', () => {
    cy.getBySel('add-announcement-btn').click();

    cy.getBySel('title-input').type(announcementAddTitle);
    cy.getBySel('content-input').type(announcementAddContent);
    cy.getBySel('memo-checkbox').click();
    cy.getBySel('viewAccess-select').select(announcementAddViewAccess);

    cy.getBySel('add-submit-btn').click();

    cy.wait('@createAnnouncement');

    cy.getBySel('close-btn').click();

    cy.wait('@getAllAnnouncement');
    cy.getBySel('announcement-row').should('have.length', 2);
    cy.getBySel('announcement-title')
      .contains(announcementAddTitle)
      .should('exist');
    cy.getBySel('announcement-content')
      .contains(announcementAddContent)
      .should('exist');
    cy.getBySel('announcement-tags')
      .contains(announcementAddTags)
      .should('exist');
    cy.getBySel('announcement-view-access')
      .contains(announcementAddViewAccess)
      .should('exist');
  });

  it('should reset the fields upon clicking reset inputs when adding announcement', () => {
    cy.getBySel('add-announcement-btn').click();

    cy.getBySel('title-input').type(announcementAddTitle);
    cy.getBySel('subtitle-input').type(announcementAddSubtitle);
    cy.getBySel('content-input').type(announcementAddContent);
    cy.getBySel('memo-checkbox').click();
    cy.getBySel('viewAccess-select').select(announcementAddViewAccess);

    cy.getBySel('reset-btn').click();
  });

  it('should edit an announcement', () => {
    const newTitle = 'EDITED ANNOUNCEMENT';
    const newSubtitle = 'EDITED SUBTITLE';
    const newContent = 'this is an edited content';
    const newViewAccess = 'PUBLIC';

    cy.getBySel('actions-btn').first().click();
    cy.getBySel('actions-edit-btn').first().click();

    cy.getBySel('title-input').clear().type(newTitle);
    cy.getBySel('subtitle-input').clear().type(newSubtitle);
    cy.getBySel('content-input').clear().type(newContent);
    cy.getBySel('information-checkbox').click();
    cy.getBySel('viewAccess-select').select(newViewAccess);

    cy.getBySel('edit-submit-btn').click();

    cy.wait('@editAnnouncement');

    // check that modal is closed
    cy.get('.chakra-modal__content').should('not.exist');

    cy.getBySel('announcement-row').should('exist');
    cy.getBySel('announcement-title').contains(newTitle).should('exist');
    cy.getBySel('announcement-subtitle').contains(newSubtitle).should('exist');
    cy.getBySel('announcement-content').contains(newContent).should('exist');
    cy.getBySel('announcement-view-access')
      .contains(newViewAccess)
      .should('exist');

    cy.getBySel('announcement-row').first().click();
    cy.getBySel('announcement-view-title').contains(newTitle).should('exist');
    cy.getBySel('announcement-view-subtitle')
      .contains(newSubtitle)
      .should('exist');
    cy.getBySel('announcement-view-content')
      .contains(newContent)
      .should('exist');
    cy.getBySel('announcement-view-view-access')
      .contains(newViewAccess)
      .should('exist');
  });

  it('should reset fields upon clicking reset button base on default values when editing', () => {
    const newTitle = 'EDITED ANNOUNCEMENT';
    const newSubtitle = 'EDITED SUBTITLE';
    const newContent = 'this is an edited content';
    const newViewAccess = 'PUBLIC';

    cy.getBySel('actions-btn').first().click();
    cy.getBySel('actions-edit-btn').first().click();

    cy.getBySel('title-input').clear().type(newTitle);
    cy.getBySel('subtitle-input').clear().type(newSubtitle);
    cy.getBySel('content-input').clear().type(newContent);
    cy.getBySel('information-checkbox').click();
    cy.getBySel('viewAccess-select').select(newViewAccess);

    cy.getBySel('reset-btn').click();
  });

  it('should delete announcement', () => {
    cy.getBySel('actions-btn').first().click();
    cy.getBySel('actions-delete-btn').first().click();
    cy.getBySel('dialog-yes-btn').click();

    cy.wait('@deleteAnnouncement');

    cy.wait('@getAllAnnouncement');

    cy.getBySel('announcement-row').should('have.length', 0);
  });
});
