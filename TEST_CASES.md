# Test Cases
 
## Login Tests
 
### Success Cases
- [ ] Login with valid credentials (`test@test.com` / `123456`)
- [ ] Login with newly created account
- [ ] Session persists after app restart
 
### Failure Cases
- [ ] Empty email field → shows "Email is required"
- [ ] Empty password field → shows "Password is required"
- [ ] Invalid email format → shows "Please enter a valid email address"
- [ ] Wrong password → shows "Invalid email or password"
- [ ] Non-existent email → shows "Invalid email or password"
- [ ] Password less than 6 chars → shows "Password must be at least 6 characters"
- [ ] Whitespace in email → should trim automatically
 
## Signup Tests
 
### Success Cases
- [ ] Signup with valid data (name, email, password)
- [ ] Auto-login after successful signup
- [ ] Navigates to home screen after signup
- [ ] New user appears in storage
 
### Failure Cases
- [ ] Empty name field → shows "Name is required"
- [ ] Name less than 2 chars → shows "Name must be at least 2 characters"
- [ ] Name too long (>50 chars) → shows "Name is too long"
- [ ] Empty email → shows "Email is required"
- [ ] Invalid email format → shows "Please enter a valid email address"
- [ ] Email already exists → shows "This email is already registered"
- [ ] Empty password → shows "Password is required"
- [ ] Password less than 6 chars → shows "Password must be at least 6 characters"
- [ ] Password too long (>128 chars) → shows "Password is too long"
- [ ] Whitespace in fields → should trim on submit
 
## Logout Tests
 
### Success Cases
- [ ] Logout button shows confirmation dialog
- [ ] Cancel keeps user logged in
- [ ] Confirm signs out successfully
- [ ] Navigates to login screen after logout
- [ ] User data cleared from storage
- [ ] Can login again after logout
 