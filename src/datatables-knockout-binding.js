(function (factory) {
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object')
        factory(require('jquery'), require('knockout'));
    else if (typeof define === 'function' && define['amd'])
        define(['jquery', 'knockout'], factory);
    else
        factory($, ko);
}(function ($, ko){
    function getOptions (allBindings) {
        return allBindings.get('tableOptions') || {};
    }

    ko.bindingHandlers.datatable = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            const data = valueAccessor();
            const update = () => {
                const oldTable = $(element).closest('table').DataTable();
                const pageInfo = oldTable.page.info();
                const page = pageInfo.page;
                const pageLength = pageInfo.length;
                const order = oldTable.order();
                const search = oldTable.search();
                oldTable.destroy();
                ko.bindingHandlers.foreach.update(element, valueAccessor, allBindings, viewModel, bindingContext);
                const tableOptions = {
                    ...getOptions(allBindings),
                    order,
                    pageLength,
                    deferLoading: true
                };

                if (tableOptions.search)
                    tableOptions.search.search = search;
                else 
                    tableOptions.search = { search };

                $(element).closest('table')
                    .DataTable(tableOptions)
                    .page(page)
                    .draw();
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
}));