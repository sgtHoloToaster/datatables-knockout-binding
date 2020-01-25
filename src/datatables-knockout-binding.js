ko.bindingHandlers.datatable = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        const data = valueAccessor();
        bindingContext.update = () => {
            const oldTable = $(element).closest('table').DataTable();
            const page = oldTable.page();
            oldTable.destroy();
            ko.bindingHandlers.foreach.update(element, valueAccessor, allBindings, viewModel, bindingContext);
            var tableOptions = allBindings.get("tableOptions") || {};
            const newTable = $(element).closest('table').DataTable(tableOptions);
            newTable.page(page).draw('page');
        };

        data.subscribe(bindingContext.update, null, 'arrayChange');
        const nodes = Array.prototype.slice.call(element.childNodes, 0);
        ko.utils.arrayForEach(nodes, function (node) {
            if (node && node.nodeType !== 1) {
                node.parentNode.removeChild(node);
            }
        });

        return ko.bindingHandlers.foreach.init(element, valueAccessor, allBindings, viewModel, bindingContext);
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        const key = 'dt-initialized';
        var data = ko.utils.unwrapObservable(valueAccessor());
        if (!ko.utils.domData.get(element, key) && data) {
            bindingContext.update();
            ko.utils.domData.set(element, key, true);
        }
    }
};