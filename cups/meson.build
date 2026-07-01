project('cups', 'cpp', default_options: ['cpp_std=c++17'])

# Add node headers path, provided by the node-addon-api package and by the node
# distribution itself.
node_addon_api_inc = include_directories('node_modules/node-addon-api')
node_headers_inc = include_directories('/usr/local/include/node')

# Alpine ships with libcups version 2.
cups_dep = dependency('cups', version: ['>=2.0.0', '<=3.0.0'])

# Build the .node module
shared_module(
    'cups',
    'src/binding.cpp',
    include_directories: [node_addon_api_inc, node_headers_inc],
    dependencies: [cups_dep],
    name_prefix: '',
    name_suffix: 'node',
)
