const fs = require('fs')

const PATHS = {
	src: __dirname + '/../../src',
	styles: __dirname + '/../../src/styles',
	dist: __dirname + '/../../dist',
	global: __dirname + '/../../src/global',
	pages: __dirname + '/../../src/pages',
	pagesDist: __dirname + '/../../dist/pages',
	templates: __dirname + '/../../src/templates',
	templatesDist: __dirname + '/../../dist/templates'
}

const PAGES = fs.readdirSync(`${PATHS.pages}/`)

const CUSTOM_TEMPLATES = fs.readdirSync(`${PATHS.templates}/Custom`)
const SUB_TEMPLATES = fs.readdirSync(`${PATHS.templates}/Sub/`)
const SHELVES_TEMPLATES = fs.readdirSync(`${PATHS.templates}/Shelves`)

module.exports = {
	PAGES,
	CUSTOM_TEMPLATES,
	SUB_TEMPLATES,
	SHELVES_TEMPLATES,
	PATHS,
}