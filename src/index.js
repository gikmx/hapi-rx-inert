'use strict';

import PATH from 'path';

import Rx     from 'rxjs/Rx';
import LoDash from 'lodash';
import Inert  from 'inert';

const Setup = {
	name : 'static',
	opts : { // These are the plugin's options
		directory: {
			path            : '.',
			redirectToSlash : true,
			index           : true
		}
	},
	conf : {   // these will be used on hapi instantiation
		connections: {
			routes: {
				files: {
					relativeTo: PATH.resolve(PATH.join('.','static'))
				}
			}
		}
	},
	conn : {}, // These will be used on hapi connection setup
};

export default (setup={}) => {

	setup = LoDash.merge(Setup, setup);
	setup.register = server => Rx.Observable.create(subscriber => {

		server.register(Inert, err => {
			if (err) return subscriber.error(err);
			server.route({
				method  : 'GET',
				path    : '/static/{param*}',
				handler : setup.opts
			});
			subscriber.next(setup);
			subscriber.complete();
		});

		return ()=> {};
	});

	return setup;
}