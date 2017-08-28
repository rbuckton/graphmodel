# JavaScript library for modeling directed graphs

`graphmodel` is a library for modeling directed graphs, based loosely on the [Visual Studio GraphModel API](https://msdn.microsoft.com/en-us/library/microsoft.visualstudio.graphmodel.aspx).

## Installation

```
npm install graphmodel
```

## Usage

```js
import { Graph } from "graphmodel";

// create a graph
const graph = new Graph();

// define schema
graph.schema.properties.getOrCreate("key");

// add nodes
const sourceNode = graph.nodes.getOrCreate("source");
const targetNode = graph.nodes.getOrCreate("target");

// add links
const link = graph.links.getOrCreate(sourceNode, targetNode);

// find targets
for (const target of sourceNode.targets()) {}

// find sources
for (const source of targetNode.sources()) {}

// add data to nodes/links 
sourceNode.set("key", value);
link.set("key", value);
```

## Advanced Usage

```js
import { Graph } from "graphmodel";

const fileSystem = new Graph();

// node categories
const file = fileSystem.schema.categories.getOrCreate("file");
const folder = fileSystem.schema.categories.getOrCreate("folder");

// link categories
const child = fileSystem.schema.categories.getOrCreate("child");
const symlink = fileSystem.schema.categories.getOrCreate("symlink");

// properties
const name = fileSystem.schema.properties.getOrCreate("name");

// add the '/' directory
const root = fileSystem.nodes.getOrCreate("/", folder);
root.set(name, "/");

// add the '/home' directory
const home = fileSystem.nodes.getOrCreate("/home", folder);
home.set(name, "home");
fileSystem.links.getOrCreate(root, home, child);

// add the '/home/jdoe' directory
const homedir = fileSystem.nodes.getOrCreate("/home/jdoe", folder);
homedir.set(name, "jdoe");
fileSystem.links.getOrCreate(home, homedir, child);

// add a '/home/jdoe/profile' file
const profile = fileSystem.nodes.getOrCreate("/home/jdoe/profile", file);
profile.set(name, "profile");
fileSystem.links.getOrCreate(homedir, profile, child);

// add a symbolic link from '/home/jdoe/profile' to '/home/jdoe/profile2'
const profile2 = fileSystem.nodes.getOrCreate("/home/jdoe/profile2", file);
profile2.set(name, "profile2");
fileSystem.links.getOrCreate(homedir, profile2, child);
fileSystem.links.getOrCreate(profile, profile2, symlink);

// find all files beneath '/'
const files = root.related("target", {
    traverseLink: link => link.hasCategory(child),
    traverseNode: node => node.hasCategory(folder),
    acceptNode: node => node.hasCategory(file)
});

// find all containing folders of '/home/jdoe/profile'
const folders = profile.related("source", {
    traverseLink: link => link.hasCategory(child),
    traverseNode: node => node.hasCategory(folder),
    acceptNode: node => node.hasCategory(folder)
});

// resolve symbolic link for '/home/jdoe/profile2'
const target = profile2.firstRelated("source", {
    traverseLink: link => link.hasCategory(symlink)
});
```

## API Overview
* [Graph](docs/graph.md)
* [GraphSchema](docs/graphSchema.md)
* [GraphSchemaCollection](docs/graphSchemaCollection.md)
* [GraphMetadataContainer](docs/graphMetadataContainer.md)
* [GraphMetadata](docs/graphMetadata.md)
* [GraphCategory](docs/graphCategory.md)
* [GraphCategoryCollection](docs/graphCategoryCollection.md)
* [GraphProperty](docs/graphProperty.md)
* [GraphPropertyCollection](docs/graphPropertyCollection.md)
* [GraphObject](docs/graphObject.md)
* [GraphNode](docs/graphNode.md)
* [GraphNodeCollection](docs/graphNodeCollection.md)
* [GraphLink](docs/graphLink.md)
* [GraphLinkCollection](docs/graphLinkCollection.md)
* [GraphCommonSchema](docs/graphCommonSchema.md)

## License

Copyright 2017 Ron Buckton

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
