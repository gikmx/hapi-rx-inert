'use strict';

import PATH from 'path';

import Rx    from 'rxjs/Rx';
import Inert from 'inert';

export default {

	setup: {
		connection : {},
		config     : {
			connections: {
				routes: {
					files: {
						relativeTo: PATH.resolve(PATH.join('.','static'))
					}
				}
			}
		}
	},

	register: (server, name) => Rx.Observable.create(subscriber => {

		let response = {name: name};

		server.register(Inert, err => {
			if (err) return subscriber.error(err);
			server.route({
				method  : 'GET',
				path    : '/static/{param*}',
				handler : {
					directory: {
						path            : '.',
						redirectToSlash : true,
						index           : true
					}
				}
			});
			subscriber.next(response);
			subscriber.complete();
		});

		return ()=> {};
	})
}