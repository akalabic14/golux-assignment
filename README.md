# golux-assignment

Inicijalizacija projekta :

```
npm install
```

Pokretanje projekta

```
npm start
```

GraphQL api se može testirati otvarajući localhost:8080/graphql gdje se nalazi graphiql editor.
U bazu je ubačen admin user { email: "admin", password: "admin" } za potrebe testiranja.

## Permisije:
Ne ulogovan korisnik:

* Može da pristupi query-ju helloGraphQL
* Može da pristupi user.login mutaciji
* Može da pristupi user.register mutaciji, nakon čega će dobiti korisnika sa permisijom user-a
* Može da pristupi user.logout mutaciji, koja će da obriše access_token iz kukija

Ulogovan korisnik sa rolom user:

* Može da pristupi query-ju post.getAll, i da vidi sve postove
* Može da pristupi mutaciji updatePassword, i da promjeni svoju sifru

Ulogovan korisnik sa rolom moderator:

* Može da pristupi queriju post.getAll, i da pregleda sve postove
* Može da pristupi queriju post.getMine, i da pregleda sve postove kojih je autor
* Može da pristupi mutaciji post.makePost, i da kreira novi post
* Može da pristupi mutaciji post.editPost, i da edituje postove kojih je autor
* Može da pristupi mutaciji post.remove, i da obriše postove kojih je autor

Ulogovan korisnik sa rolom admin:

* Može da pristupi svim query-ima, da briše, mjenja, i dodaje user-e i postove.