(function (){
    function getOptions (allBindings) {
        return allBindings.get('tableOptions') || {};
    }

    ko.bindingHandlers.datatable = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            const data = valueAccessor();
            const update = () => {
                const oldTable = $(element).closest('table').DataTable();
                const page = oldTable.page();
                oldTable.destroy();
                ko.bindingHandlers.foreach.update(element, valueAccessor, allBindings, viewModel, bindingContext);
                const tableOptions = getOptions(allBindings);
                const newTable = $(element).closest('table').DataTable(tableOptions);
                newTable.page(page).draw('page');
            };

            data.subscribe(update, null, 'arrayChange');
            ko.utils.arrayForEach(element.childNodes, function (node) {
                if (node && node.nodeType !== 1 /*element*/)
                    node.parentNode.removeChild(node);
            });

            ko.bindingHandlers.foreach.init(element, valueAccessor, allBindings, viewModel, bindingContext);
            ko.bindingHandlers.foreach.update(element, valueAccessor, allBindings, viewModel, bindingContext);
            const tableOptions = getOptions(allBindings);
            $(element).closest('table').DataTable(tableOptions);
            return { controlsDescendantBindings: true };
        }
    };
})();