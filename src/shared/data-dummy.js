import _ from 'lodash';

class User {
	constructor(fn, ln) {
		this.firstName = fn;
		this.lastName = ln;
	}

	helper() {
		this.login = `${this.firstName.slice(0, 1)}.${this.lastName}@samsung.com`
		this.phone = "(000) 000-0000";
		this.status = "Active";
		this.firstName = _.capitalize(this.firstName);
		this.lastName = _.capitalize(this.lastName);
	}

		get() {
		this.helper();
		return this;
	}
}

const admins = [
	new User("gautham", "stalin").get(),
	new User("christine", "manfredo").get(),
	new User("hyunJun", "jung").get(),
	new User("shalini", "pachineela").get(),
	new User("gaurav", "murti").get(),
	new User("cesar", "sanchez").get()
];

const dummy = {
	admins
};

export default dummy;