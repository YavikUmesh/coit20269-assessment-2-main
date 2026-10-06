# User Stories & High-Level User Requirements — StudySwap

Written from the user's perspective. Feeds the presentation slides (Part B) and defines what the app must do (Part A functionality marks).

## Personas

- **Seller** — a CQU student with used textbooks/furniture/electronics to offload before moving or between terms.
- **Buyer** — a CQU student looking for cheap second-hand items from people they can meet on campus safely.

## Epic 1 — Account & Access

### US-1: Sign up
> As a CQU student, I want to create an account with my name, email and password, so that I can buy and sell as a trusted member of the app.

**Acceptance criteria (Given/When/Then)**
- Given I am on the sign-up screen, when I submit a valid name/email/password, then my account is created and I am logged in.
- Given I submit an email that already exists, then I see a clear error and no account is created.
- Given I submit a password that is too short (< 8 chars), then I see a validation error.

### US-2: Log in
> As a returning user, I want to log in with my email and password, so that I can access my account and listings.

- Given valid credentials, when I submit, then I land on the browse page logged in.
- Given invalid credentials, then I see an error message and stay on the login page.

### US-3: Log out
> As a logged-in user, I want to log out, so that nobody else using my device can access my account.

- Given I tap logout, then my session token is cleared and I am returned to the login page.
- Given I am logged out, when I try to open a members-only page, then I am redirected to login.

## Epic 2 — Listings

### US-4: Browse listings
> As a buyer, I want to see a list of all active listings, so that I can find items for sale.

- Given listings exist, when I open the browse page, then I see title, price and photo for each active listing.
- Given a listing was marked sold, then it no longer appears in the default browse list.

### US-5: Filter by category
> As a buyer, I want to filter listings by category (textbooks, furniture, electronics, other), so that I find relevant items faster.

- Given I select a category, then only listings in that category are shown.

### US-6: View listing detail
> As a buyer, I want to open a listing to see full details and the seller, so that I can decide whether to contact them.

- Given I tap a listing, then I see all photos, description, price, category, seller name and posted date.

### US-7: Create a listing
> As a seller, I want to post an item with a title, description, price, category and photo, so that buyers can find it.

- Given I am logged in and complete the form with a photo (taken via camera), when I submit, then the listing appears in browse.
- Given I am not logged in, then I cannot access the create-listing page.
- Given I submit without a title or price, then I see a validation error.

### US-8: Edit my listing
> As a seller, I want to edit my own listing's details or price, so that the information stays accurate.

- Given I am the listing's owner, when I edit and save, then the updated details are shown.
- Given I am not the owner, then no edit option is shown and the API rejects the request.

### US-9: Mark listing as sold
> As a seller, I want to mark an item as sold, so that buyers stop contacting me about it.

- Given I am the owner, when I mark sold, then the listing shows a "sold" badge and is excluded from default browse.

### US-10: Delete my listing
> As a seller, I want to delete my listing, so that removed/irrelevant items don't clutter the marketplace.

- Given I am the owner, when I delete and confirm, then the listing is removed from browse and my profile.
- Given I am not the owner, then the API rejects the delete.

## Epic 3 — Profile

### US-11: View my profile
> As a logged-in user, I want to see my name and email, so that I can confirm which account I'm using.

- Given I am logged in, when I open profile, then I see my details.

### US-12: View my listings
> As a seller, I want to see a list of my own listings (active and sold), so that I can manage them.

- Given I have listings, when I open "my listings", then I see them with edit/delete/mark-sold actions.

## Traceability — Stories → Issues → HTTP Verbs

| Story | Feature | Issue(s) | HTTP verbs |
|---|---|---|---|
| US-1–3 | Auth (sign-up/login/logout) | #11, #15 | POST |
| US-4–6 | Browse/detail | #12, #16 | GET |
| US-7 | Create listing | #12, #17 | POST |
| US-8 | Edit listing | #12, #17 | PUT |
| US-9 | Mark sold | #12, #17 | PUT |
| US-10 | Delete listing | #12, #17 | DELETE |
| US-11–12 | Profile | #12, #16 | GET |

✅ Requirement check: user interactions use **GET, POST, PUT and DELETE** — exceeds the "at least three different types" requirement.

## Out of Scope (v1)

- In-app chat/messaging between buyers and sellers (contact via listed method)
- Payment processing (cash on meetup)
- Ratings/reviews
